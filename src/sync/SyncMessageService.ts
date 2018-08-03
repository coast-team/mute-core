import { LogootSAdd, LogootSDel, LogootSOperation } from 'mute-structs'
import { Observable, Subject, zip } from 'rxjs'

import { IMessageIn, IMessageOut, Service } from '../misc'
import { sync } from '../proto'
import { Streams } from '../Streams'
import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { StateVector } from './StateVector'

export class SyncMessageService extends Service {
  private remoteQuerySyncSubject: Subject<StateVector>
  private remoteQuerySyncIdSubject: Subject<number>
  private remoteRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private remoteReplySyncSubject: Subject<ReplySyncEvent>

  constructor(messageIn: Observable<IMessageIn>, messageOut: Subject<IMessageOut>) {
    super(messageIn, messageOut, Streams.DOCUMENT_CONTENT)

    this.remoteQuerySyncSubject = new Subject()
    this.remoteQuerySyncIdSubject = new Subject()
    this.remoteRichLogootSOperationSubject = new Subject()
    this.remoteReplySyncSubject = new Subject()

    // FIXME: should I save the subscription for later unsubscribe/subscribe?
    this.newSub = messageIn.subscribe(({ sernderId, content }) => {
      const msg = sync.SyncMsg.decode(content)
      switch (msg.type) {
        case 'richLogootSOpMsg':
          this.handleRichLogootSOpMsg(msg.richLogootSOpMsg as sync.RichLogootSOperationMsg)
          break
        case 'querySync':
          this.remoteQuerySyncIdSubject.next(sernderId) // Register the id of the peer
          this.handleQuerySyncMsg(msg.querySync as sync.QuerySyncMsg)
          break
        case 'replySync':
          this.handleReplySyncMsg(msg.replySync as sync.ReplySyncMsg)
          break
      }
    })
  }

  set localRichLogootSOperationSource(source: Observable<RichLogootSOperation>) {
    this.newSub = source.subscribe((richLogootSOp: RichLogootSOperation) => {
      super.send(this.generateRichLogootSOpMsg(richLogootSOp))
    })
  }

  set querySyncSource(source: Observable<StateVector>) {
    this.newSub = source.subscribe((vector: StateVector) => {
      super.send(this.generateQuerySyncMsg(vector))
    })
  }

  set replySyncSource(source: Observable<ReplySyncEvent>) {
    this.newSub = zip(
      source,
      this.remoteQuerySyncIdSubject.asObservable(),
      (replySyncEvent: ReplySyncEvent, id: number) => ({ id, replySyncEvent })
    ).subscribe(({ id, replySyncEvent: { richLogootSOps, intervals } }) => {
      super.send(this.generateReplySyncMsg(richLogootSOps, intervals), id)
    })
  }

  get onRemoteRichLogootSOperation(): Observable<RichLogootSOperation> {
    return this.remoteRichLogootSOperationSubject.asObservable()
  }

  get onRemoteQuerySync(): Observable<StateVector> {
    return this.remoteQuerySyncSubject.asObservable()
  }

  get onRemoteReplySync(): Observable<ReplySyncEvent> {
    return this.remoteReplySyncSubject.asObservable()
  }

  dispose(): void {
    this.remoteQuerySyncSubject.complete()
    this.remoteQuerySyncIdSubject.complete()
    this.remoteRichLogootSOperationSubject.complete()
    this.remoteReplySyncSubject.complete()
    super.dispose()
  }

  handleRichLogootSOpMsg(content: sync.RichLogootSOperationMsg): void {
    const richLogootSOp: RichLogootSOperation | null = this.deserializeRichLogootSOperation(content)

    this.remoteRichLogootSOperationSubject.next(richLogootSOp)
  }

  handleQuerySyncMsg(content: sync.QuerySyncMsg): void {
    const map: Map<number, number> = new Map()
    Object.keys(content.vector).forEach((key: string) => {
      const newKey = parseInt(key, 10)
      map.set(newKey, content.vector[key])
    })
    const vector: StateVector = new StateVector(map)
    this.remoteQuerySyncSubject.next(vector)
  }

  handleReplySyncMsg(content: sync.ReplySyncMsg): void {
    const richLogootSOpsList = content.richLogootSOpsMsg
    const richLogootSOps: RichLogootSOperation[] = richLogootSOpsList.map((richLogootSOpMsg) => {
      return this.deserializeRichLogootSOperation(richLogootSOpMsg as sync.RichLogootSOperationMsg)
    })

    // FIXME: id, begin, end must not be undefined
    const intervals = content.intervals.map(({ id, begin, end }) => {
      if (id && begin && end) {
        return new Interval(id, begin, end)
      } else {
        return undefined
      }
    }) as Interval[]

    const replySyncEvent: ReplySyncEvent = new ReplySyncEvent(richLogootSOps, intervals)
    this.remoteReplySyncSubject.next(replySyncEvent)
  }

  generateRichLogootSOpMsg(richLogootSOp: RichLogootSOperation): Uint8Array {
    const richLogootSOperationMsg = this.serializeRichLogootSOperation(richLogootSOp)
    const msg = sync.SyncMsg.create({ richLogootSOpMsg: richLogootSOperationMsg })
    return sync.SyncMsg.encode(msg).finish()
  }

  // TODO: Watch this function
  serializeRichLogootSOperation(richLogootSOp: RichLogootSOperation): sync.RichLogootSOperationMsg {
    const richLogootSOperationMsg = sync.RichLogootSOperationMsg.create({
      id: richLogootSOp.id,
      clock: richLogootSOp.clock,
      dependencies: richLogootSOp.dependencies,
    })
    const logootSOp: LogootSOperation = richLogootSOp.logootSOp
    if (logootSOp instanceof LogootSDel) {
      richLogootSOperationMsg.logootSDelMsg = sync.LogootSDelMsg.create(logootSOp)
    } else if (logootSOp instanceof LogootSAdd) {
      richLogootSOperationMsg.logootSAddMsg = sync.LogootSAddMsg.create(logootSOp)
    }

    return richLogootSOperationMsg
  }

  deserializeRichLogootSOperation(content: sync.RichLogootSOperationMsg): RichLogootSOperation {
    const id: number = content.id
    const clock: number = content.clock
    const dependencies = content.dependencies as sync.IDotMsg[]

    let logootSOp: sync.ILogootSAddMsg | sync.ILogootSDelMsg | undefined
    if (content.logootSAddMsg) {
      logootSOp = content.logootSAddMsg
    } else if (content.logootSDelMsg) {
      logootSOp = content.logootSDelMsg
    }

    return RichLogootSOperation.fromPlain({
      id,
      clock,
      logootSOp,
      dependencies,
    }) as RichLogootSOperation
  }

  generateQuerySyncMsg(vector: StateVector): Uint8Array {
    const querySyncMsg = sync.QuerySyncMsg.create()

    // FIXME: clock and id must not be undefined
    vector.forEach((clock, id) => {
      if (id && clock) {
        querySyncMsg.vector[id] = clock
      }
    })

    const msg = sync.SyncMsg.create({ querySync: querySyncMsg })

    return sync.SyncMsg.encode(msg).finish()
  }

  generateReplySyncMsg(richLogootSOps: RichLogootSOperation[], intervals: Interval[]): Uint8Array {
    const replySyncMsg = sync.ReplySyncMsg.create()

    replySyncMsg.richLogootSOpsMsg = richLogootSOps.map((richLogootSOp: RichLogootSOperation) => {
      return this.serializeRichLogootSOperation(richLogootSOp)
    })

    const intervalsMsg = intervals.map((interval: Interval) => {
      const intervalMsg = sync.IntervalMsg.create({
        id: interval.id,
        begin: interval.begin,
        end: interval.end,
      })
      return intervalMsg
    })
    replySyncMsg.intervals = intervalsMsg

    const msg = sync.SyncMsg.create({ replySync: replySyncMsg })

    return sync.SyncMsg.encode(msg).finish()
  }
}
