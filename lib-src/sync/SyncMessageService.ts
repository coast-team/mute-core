import { Identifier, IdentifierInterval, LogootSDel, LogootSAdd } from 'mute-structs'
import { Observable, Subject, Subscription } from 'rxjs'

import { Interval } from './Interval'
import { BroadcastMessage, MessageEmitter, NetworkMessage, SendRandomlyMessage, SendToMessage } from '../network/'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'

import { Sync, QuerySync, ReplySync, LogootSAddMsg, LogootSDelMsg, RichLogootSOperationMsg, IntervalMsg, IdentifierMsg, IdentifierIntervalMsg } from '../../proto/sync_pb'

export class SyncMessageService implements MessageEmitter {

  private static ID: string = 'SyncMessage'

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>
  private remoteQuerySyncSubject: Subject<Map<number, number>>
  private remoteQuerySyncIdSubject: Subject<number>
  private remoteRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private remoteReplySyncSubject: Subject<ReplySyncEvent>

  private localRichLogootSOperationSubscription: Subscription
  private messageSubscription: Subscription
  private querySyncSubscription: Subscription
  private replySyncSubscription: Subscription

  constructor () {
    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
    this.remoteQuerySyncSubject = new Subject()
    this.remoteQuerySyncIdSubject = new Subject()
    this.remoteRichLogootSOperationSubject = new Subject()
    this.remoteReplySyncSubject = new Subject()
  }

  set localRichLogootSOperationSource (source: Observable<RichLogootSOperation>) {
    this.localRichLogootSOperationSubscription = source.subscribe((richLogootSOp: RichLogootSOperation) => {
      const richLogootSOpMsg = this.generateRichLogootSOpMsg(richLogootSOp)
      const msg: BroadcastMessage = new BroadcastMessage(SyncMessageService.ID, Sync.encode(richLogootSOpMsg).finish())
      this.msgToBroadcastSubject.next(msg)
    })
  }

  set messageSource (source: Observable<NetworkMessage>) {
    this.messageSubscription = source
    .filter((msg: NetworkMessage) => msg.service === SyncMessageService.ID)
    .subscribe((msg: NetworkMessage) => {
      const content = Sync.decode(msg.content)
      switch (content.type) {
        case 'richLogootSOpMsg':
          this.handleRichLogootSOpMsg(content.richLogootSOpMsg as RichLogootSOperationMsg)
          break
        case 'querySync':
          this.remoteQuerySyncIdSubject.next(msg.id) // Register the id of the peer
          this.handleQuerySyncMsg(content.querySync as QuerySync)
          break
        case 'replySync':
          this.handleReplySyncMsg(content.replySync as ReplySync)
          break
      }
    })
  }

  set querySyncSource (source: Observable<Map<number, number>>) {
    this.querySyncSubscription = source.subscribe((vector: Map<number, number>) => {
      const querySyncMsg = this.generateQuerySyncMsg(vector)
      const msg: SendRandomlyMessage = new SendRandomlyMessage(SyncMessageService.ID, Sync.encode(querySyncMsg).finish())
      this.msgToSendRandomlySubject.next(msg)
    })
  }

  set replySyncSource (source: Observable<ReplySyncEvent>) {
    this.replySyncSubscription = Observable.zip(
      source,
      this.remoteQuerySyncIdSubject.asObservable(),
      (replySyncEvent: ReplySyncEvent, id: number) => {
        return { id, replySyncEvent }
      })
      .subscribe(({ id, replySyncEvent}: { id: number, replySyncEvent: ReplySyncEvent }) => {
        const replySyncMsg = this.generateReplySyncMsg(replySyncEvent.richLogootSOps, replySyncEvent.intervals)
        const msg: SendToMessage = new SendToMessage(SyncMessageService.ID, id, Sync.encode(replySyncMsg).finish())
        this.msgToSendToSubject.next(msg)
      })
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

  get onRemoteRichLogootSOperation (): Observable<RichLogootSOperation> {
    return this.remoteRichLogootSOperationSubject.asObservable()
  }

  get onRemoteQuerySync (): Observable<Map<number, number>> {
    return this.remoteQuerySyncSubject.asObservable()
  }

  get onRemoteReplySync (): Observable<ReplySyncEvent> {
    return this.remoteReplySyncSubject.asObservable()
  }

  clean (): void {
    this.msgToBroadcastSubject.complete()
    this.msgToSendRandomlySubject.complete()
    this.msgToSendToSubject.complete()
    this.remoteQuerySyncSubject.complete()
    this.remoteQuerySyncIdSubject.complete()
    this.remoteRichLogootSOperationSubject.complete()
    this.remoteReplySyncSubject.complete()

    this.localRichLogootSOperationSubscription.unsubscribe()
    this.messageSubscription.unsubscribe()
    this.querySyncSubscription.unsubscribe()
    this.replySyncSubscription.unsubscribe()
  }

  handleRichLogootSOpMsg (content: RichLogootSOperationMsg): any {
    const richLogootSOp: RichLogootSOperation = this.deserializeRichLogootSOperation(content)

    this.remoteRichLogootSOperationSubject.next(richLogootSOp)
    return richLogootSOp
  }

  handleQuerySyncMsg (content: QuerySync): any {
    let vector: Map<number, number> = new Map()
    Object.keys(content.vector).forEach((key) => {
      let newKey = parseInt(key, 10)
      vector.set(newKey, content.vector[key])
    })
    this.remoteQuerySyncSubject.next(vector)
    return vector
  }

  handleReplySyncMsg (content: ReplySync): any {
    const richLogootSOpsList: any[] = content.richLogootSOpsMsg
    const richLogootSOps: RichLogootSOperation[] = richLogootSOpsList.map((richLogootSOpMsg: any) => {
      return this.deserializeRichLogootSOperation(richLogootSOpMsg)
    })

    const intervals: Interval[] = content.intervals.map((interval: IntervalMsg) => {
      return new Interval(interval.id, interval.begin, interval.end)
    })

    const replySyncEvent: ReplySyncEvent = new ReplySyncEvent(richLogootSOps, intervals)
    this.remoteReplySyncSubject.next(replySyncEvent)
    return replySyncEvent
  }

  generateRichLogootSOpMsg (richLogootSOp: RichLogootSOperation): Sync {
    const richLogootSOperationMsg = this.serializeRichLogootSOperation(richLogootSOp)
    const msg = Sync.create({richLogootSOpMsg: richLogootSOperationMsg})
    return msg
  }

  // TODO: Watch this function
  serializeRichLogootSOperation (richLogootSOp: RichLogootSOperation): RichLogootSOperationMsg {
    let richLogootSOperationMsg = RichLogootSOperationMsg.create({ id: richLogootSOp.id, clock: richLogootSOp.clock})
    const logootSOp: LogootSAdd | LogootSDel = richLogootSOp.logootSOp
    if (logootSOp instanceof LogootSDel) {
      richLogootSOperationMsg.logootSDelMsg = this.generateLogootSDelMsg(logootSOp)
    }
    else if (logootSOp instanceof LogootSAdd) {
      richLogootSOperationMsg.logootSAddMsg = this.generateLogootSAddMsg(logootSOp)
    }

    return richLogootSOperationMsg
  }

  deserializeRichLogootSOperation (content: RichLogootSOperationMsg): RichLogootSOperation {
    const id: number = content.id
    const clock: number = content.clock

    let logootSOp: LogootSAdd | LogootSDel
    if (content.logootSAddMsg) {
      const logootSAddMsg = content.logootSAddMsg
      const identifier: Identifier = new Identifier(logootSAddMsg.id.base, logootSAddMsg.id.last)
      logootSOp = new LogootSAdd(identifier, logootSAddMsg.content)
    } else {
      const logootSDelMsg: LogootSDelMsg = content.logootSDelMsg as LogootSDelMsg
      const lid: any = logootSDelMsg.lid.map( (identifier: IdentifierIntervalMsg) => {
        return new IdentifierInterval(identifier.base, identifier.begin, identifier.end)
      })
      logootSOp = new LogootSDel(lid)
    }

    return new RichLogootSOperation(id, clock, logootSOp)
  }

  generateLogootSAddMsg (logootSAdd: LogootSAdd): LogootSAddMsg {
    const identifier = IdentifierMsg.create({base: logootSAdd.id.base, last: logootSAdd.id.last})
    return LogootSAddMsg.create({id: identifier, content: logootSAdd.l})
  }

  generateLogootSDelMsg (logootSDel: LogootSDel): LogootSDelMsg {
    const lid: IdentifierIntervalMsg[] = logootSDel.lid.map( (id: any) => {
      const identifierInterval: IdentifierIntervalMsg = this.generateIdentifierIntervalMsg(id)
      return identifierInterval
    })
    const logootSDelMsg = LogootSDelMsg.create({lid})
    return logootSDelMsg
  }

  generateIdentifierIntervalMsg (id: IdentifierInterval): IdentifierIntervalMsg {
    const identifierIntervalMsg = IdentifierIntervalMsg.create({base: id.base, begin: id.begin, end: id.end})
    return identifierIntervalMsg
  }

  generateQuerySyncMsg (vector: Map<number, number>): Sync {
    const querySyncMsg = QuerySync.create()

    vector.forEach((clock: number, id: number) => {
      querySyncMsg.vector[id] = clock
    })

    const msg = Sync.create({querySync: querySyncMsg})

    return msg
  }

  generateReplySyncMsg (richLogootSOps: RichLogootSOperation[], intervals: Interval[]): Sync {
    const replySyncMsg = ReplySync.create()

    replySyncMsg.richLogootSOpsMsg = (richLogootSOps.map((richLogootSOp: RichLogootSOperation) => {
      return this.serializeRichLogootSOperation(richLogootSOp)
    }))

    const intervalsMsg = intervals.map((interval: Interval) => {
      const intervalMsg = IntervalMsg.create({ id: interval.id, begin: interval.begin, end: interval.end})
      return intervalMsg
    })
    replySyncMsg.intervals = intervalsMsg

    const msg = Sync.create({replySync: replySyncMsg})

    return msg
  }

}
