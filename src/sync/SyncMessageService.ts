import { LogootSAdd, LogootSDel } from 'mute-structs'
import { Observable, Subject, zip } from 'rxjs'

import { IMessageIn, IMessageOut, Service } from '../misc'
import { sync as proto } from '../proto'
import { Streams } from '../Streams'
import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { StateVector } from './StateVector'

export class SyncMessageService extends Service<proto.ISyncMsg, proto.SyncMsg> {
  private remoteQuerySyncSubject: Subject<StateVector>
  private remoteQuerySyncIdSubject: Subject<number>
  private remoteRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private remoteReplySyncSubject: Subject<ReplySyncEvent>

  constructor(messageIn$: Observable<IMessageIn>, messageOut$: Subject<IMessageOut>) {
    super(messageIn$, messageOut$, Streams.DOCUMENT_CONTENT, proto.SyncMsg)

    this.remoteQuerySyncSubject = new Subject()
    this.remoteQuerySyncIdSubject = new Subject()
    this.remoteRichLogootSOperationSubject = new Subject()
    this.remoteReplySyncSubject = new Subject()

    // FIXME: should I save the subscription for later unsubscribe/subscribe?
    this.newSub = this.messageIn$.subscribe(({ senderId, msg }) => {
      switch (msg.type) {
        case 'richLogootSOpMsg':
          this.handleRichLogootSOpMsg(msg.richLogootSOpMsg as proto.RichLogootSOperationMsg)
          break
        case 'querySync':
          this.remoteQuerySyncIdSubject.next(senderId) // Register the id of the peer
          this.handleQuerySyncMsg(msg.querySync as proto.QuerySyncMsg)
          break
        case 'replySync':
          this.handleReplySyncMsg(msg.replySync as proto.ReplySyncMsg)
          break
      }
    })
  }

  set localRichLogootSOperations$(source: Observable<RichLogootSOperation>) {
    this.newSub = source.subscribe((richLogootSOp) => {
      super.send({ richLogootSOpMsg: this.serializeRichLogootSOperation(richLogootSOp) })
    })
  }

  set querySync$(source: Observable<StateVector>) {
    this.newSub = source.subscribe((vector) => {
      const querySync = proto.QuerySyncMsg.create()

      // FIXME: clock and id must not be undefined
      vector.forEach((clock, id) => {
        if (id !== undefined && clock !== undefined) {
          querySync.vector[id] = clock
        }
      })
      super.send({ querySync })
    })
  }

  set replySync$(source: Observable<ReplySyncEvent>) {
    this.newSub = zip(
      source,
      this.remoteQuerySyncIdSubject.asObservable(),
      (replySyncEvent, id) => ({ id, replySyncEvent })
    ).subscribe(({ id, replySyncEvent: { richLogootSOps, intervals } }) => {
      const replySync = proto.ReplySyncMsg.create()

      replySync.richLogootSOpsMsg = richLogootSOps.map((o) => this.serializeRichLogootSOperation(o))
      replySync.intervals = intervals.map(({ id, begin, end }) =>
        proto.IntervalMsg.create({ id, begin, end })
      )
      super.send({ replySync }, id)
    })
  }

  get remoteRichLogootSOperations$(): Observable<RichLogootSOperation> {
    return this.remoteRichLogootSOperationSubject.asObservable()
  }

  get remoteQuerySync$(): Observable<StateVector> {
    return this.remoteQuerySyncSubject.asObservable()
  }

  get remoteReplySync$(): Observable<ReplySyncEvent> {
    return this.remoteReplySyncSubject.asObservable()
  }

  dispose(): void {
    this.remoteQuerySyncSubject.complete()
    this.remoteQuerySyncIdSubject.complete()
    this.remoteRichLogootSOperationSubject.complete()
    this.remoteReplySyncSubject.complete()
    super.dispose()
  }

  private handleRichLogootSOpMsg(content: proto.RichLogootSOperationMsg): void {
    this.remoteRichLogootSOperationSubject.next(this.deserializeRichLogootSOperation(content))
  }

  private handleQuerySyncMsg(content: proto.QuerySyncMsg): void {
    const map = new Map()
    Object.keys(content.vector).forEach((key) => {
      map.set(parseInt(key, 10), content.vector[key])
    })
    this.remoteQuerySyncSubject.next(new StateVector(map))
  }

  private handleReplySyncMsg({ richLogootSOpsMsg, intervals }: proto.ReplySyncMsg): void {
    const richLogootSOps = richLogootSOpsMsg.map((o) =>
      this.deserializeRichLogootSOperation(o as proto.RichLogootSOperationMsg)
    )

    this.remoteReplySyncSubject.next(
      new ReplySyncEvent(
        richLogootSOps,
        intervals.map(
          ({ id, begin, end }) => new Interval(id as number, begin as number, end as number)
        )
      )
    )
  }

  // TODO: Watch this function
  private serializeRichLogootSOperation({
    id,
    clock,
    dependencies,
    logootSOp,
  }: RichLogootSOperation): proto.RichLogootSOperationMsg {
    const res = proto.RichLogootSOperationMsg.create({ id, clock, dependencies })
    if (logootSOp instanceof LogootSDel) {
      res.logootSDelMsg = proto.LogootSDelMsg.create(logootSOp)
    } else if (logootSOp instanceof LogootSAdd) {
      res.logootSAddMsg = proto.LogootSAddMsg.create(logootSOp)
    }

    return res
  }

  private deserializeRichLogootSOperation({
    id,
    clock,
    dependencies,
    logootSAddMsg,
    logootSDelMsg,
  }: proto.RichLogootSOperationMsg): RichLogootSOperation {
    const addOpe = LogootSAdd.fromPlain(logootSAddMsg)
    const delOpe = LogootSDel.fromPlain(logootSDelMsg)
    return RichLogootSOperation.fromPlain({
      id,
      clock,
      logootSOp: addOpe || delOpe,
      dependencies,
    }) as RichLogootSOperation
  }
}
