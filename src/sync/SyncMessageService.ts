import {
  Dot,
  Identifier,
  IdentifierInterval,
  LogootSAdd,
  LogootSDel,
  LogootSOperation,
} from 'mute-structs'
import { Observable, Subject, Subscription, zip } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'

import { Disposable } from '../Disposable'
import {
  BroadcastMessage,
  MessageEmitter,
  NetworkMessage,
  SendRandomlyMessage,
  SendToMessage,
} from '../network/'
import { sync } from '../proto'
import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { StateVector } from './StateVector'

export class SyncMessageService implements Disposable, MessageEmitter {
  public static ID: number = 423

  private disposeSubject: Subject<void>
  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>
  private remoteQuerySyncSubject: Subject<StateVector>
  private remoteQuerySyncIdSubject: Subject<number>
  private remoteRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private remoteReplySyncSubject: Subject<ReplySyncEvent>

  private msgSource: Subscription

  constructor() {
    this.disposeSubject = new Subject()
    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
    this.remoteQuerySyncSubject = new Subject()
    this.remoteQuerySyncIdSubject = new Subject()
    this.remoteRichLogootSOperationSubject = new Subject()
    this.remoteReplySyncSubject = new Subject()
  }

  set localRichLogootSOperationSource(source: Observable<RichLogootSOperation>) {
    source.pipe(takeUntil(this.onDispose)).subscribe((richLogootSOp: RichLogootSOperation) => {
      const richLogootSOpMsg = this.generateRichLogootSOpMsg(richLogootSOp)
      const msg: BroadcastMessage = new BroadcastMessage(SyncMessageService.ID, richLogootSOpMsg)
      this.msgToBroadcastSubject.next(msg)
    })
  }

  set messageSource(source: Observable<NetworkMessage>) {
    if (this.msgSource) {
      this.msgSource.unsubscribe()
    }
    this.msgSource = source
      .pipe(
        takeUntil(this.onDispose),
        filter((msg: NetworkMessage) => msg.service === SyncMessageService.ID)
      )
      .subscribe((msg: NetworkMessage) => {
        const content = sync.SyncMsg.decode(msg.content)
        switch (content.type) {
          case 'richLogootSOpMsg':
            this.handleRichLogootSOpMsg(content.richLogootSOpMsg as sync.RichLogootSOperationMsg)
            break
          case 'querySync':
            this.remoteQuerySyncIdSubject.next(msg.id) // Register the id of the peer
            this.handleQuerySyncMsg(content.querySync as sync.QuerySyncMsg)
            break
          case 'replySync':
            this.handleReplySyncMsg(content.replySync as sync.ReplySyncMsg)
            break
        }
      })
  }

  set querySyncSource(source: Observable<StateVector>) {
    source.pipe(takeUntil(this.onDispose)).subscribe((vector: StateVector) => {
      const querySyncMsg = this.generateQuerySyncMsg(vector)
      const msg: SendRandomlyMessage = new SendRandomlyMessage(SyncMessageService.ID, querySyncMsg)
      this.msgToSendRandomlySubject.next(msg)
    })
  }

  set replySyncSource(source: Observable<ReplySyncEvent>) {
    zip(
      source,
      this.remoteQuerySyncIdSubject.asObservable(),
      (replySyncEvent: ReplySyncEvent, id: number) => {
        return { id, replySyncEvent }
      }
    )
      .pipe(takeUntil(this.onDispose))
      .subscribe(({ id, replySyncEvent }: { id: number; replySyncEvent: ReplySyncEvent }) => {
        const replySyncMsg = this.generateReplySyncMsg(
          replySyncEvent.richLogootSOps,
          replySyncEvent.intervals
        )
        const msg: SendToMessage = new SendToMessage(SyncMessageService.ID, id, replySyncMsg)
        this.msgToSendToSubject.next(msg)
      })
  }

  get onDispose(): Observable<void> {
    return this.disposeSubject.asObservable()
  }

  get onMsgToBroadcast(): Observable<BroadcastMessage> {
    return this.msgToBroadcastSubject.asObservable()
  }

  get onMsgToSendRandomly(): Observable<SendRandomlyMessage> {
    return this.msgToSendRandomlySubject.asObservable()
  }

  get onMsgToSendTo(): Observable<SendToMessage> {
    return this.msgToSendToSubject.asObservable()
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
    this.disposeSubject.next()
    this.disposeSubject.complete()
    this.msgToBroadcastSubject.complete()
    this.msgToSendRandomlySubject.complete()
    this.msgToSendToSubject.complete()
    this.remoteQuerySyncSubject.complete()
    this.remoteQuerySyncIdSubject.complete()
    this.remoteRichLogootSOperationSubject.complete()
    this.remoteReplySyncSubject.complete()
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

    const intervals: Interval[] = content.intervals.map((interval: sync.IntervalMsg) => {
      return new Interval(interval.id, interval.begin, interval.end)
    })

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

    let logootSOp: sync.ILogootSAddMsg | sync.ILogootSDelMsg
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
    })
  }

  generateQuerySyncMsg(vector: StateVector): Uint8Array {
    const querySyncMsg = sync.QuerySyncMsg.create()

    vector.forEach((clock: number, id: number) => {
      querySyncMsg.vector[id] = clock
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
