import { Identifier, IdentifierInterval, LogootSDel, LogootSAdd } from 'mute-structs'
import { Observable, Subject } from 'rxjs'

import { Interval } from './Interval'
import { BroadcastMessage, MessageEmitter, NetworkMessage, SendRandomlyMessage, SendToMessage } from '../network/'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'

import { Sync, QuerySync, ReplySync, LogootSAddMsg, LogootSDelMsg, RichLogootSOperationMsg, IntervalMsg, IdentifierMsg, IdentifierIntervalMsg } from '../../proto/sync_pb'

export class SyncMessageService implements MessageEmitter {

  private static ID: string = 'SyncMessage'

  private disposeSubject: Subject<void>
  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>
  private remoteQuerySyncSubject: Subject<Map<number, number>>
  private remoteQuerySyncIdSubject: Subject<number>
  private remoteRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private remoteReplySyncSubject: Subject<ReplySyncEvent>

  constructor () {
    this.disposeSubject = new Subject()
    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
    this.remoteQuerySyncSubject = new Subject()
    this.remoteQuerySyncIdSubject = new Subject()
    this.remoteRichLogootSOperationSubject = new Subject()
    this.remoteReplySyncSubject = new Subject()
  }

  set localRichLogootSOperationSource (source: Observable<RichLogootSOperation>) {
    source
      .takeUntil(this.onDispose)
      .subscribe((richLogootSOp: RichLogootSOperation) => {
        const richLogootSOpMsg = this.generateRichLogootSOpMsg(richLogootSOp)
        const msg: BroadcastMessage = new BroadcastMessage(SyncMessageService.ID, richLogootSOpMsg)
        this.msgToBroadcastSubject.next(msg)
      })
  }

  set messageSource (source: Observable<NetworkMessage>) {
    source
      .takeUntil(this.onDispose)
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
    source
      .takeUntil(this.onDispose)
      .subscribe((vector: Map<number, number>) => {
        const querySyncMsg = this.generateQuerySyncMsg(vector)
        const msg: SendRandomlyMessage = new SendRandomlyMessage(SyncMessageService.ID, querySyncMsg)
        this.msgToSendRandomlySubject.next(msg)
      })
  }

  set replySyncSource (source: Observable<ReplySyncEvent>) {
    Observable.zip(
      source,
      this.remoteQuerySyncIdSubject.asObservable(),
      (replySyncEvent: ReplySyncEvent, id: number) => {
        return { id, replySyncEvent }
      })
      .takeUntil(this.onDispose)
      .subscribe(({ id, replySyncEvent}: { id: number, replySyncEvent: ReplySyncEvent }) => {
        const replySyncMsg = this.generateReplySyncMsg(replySyncEvent.richLogootSOps, replySyncEvent.intervals)
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
    this.disposeSubject.complete()
    this.msgToBroadcastSubject.complete()
    this.msgToSendRandomlySubject.complete()
    this.msgToSendToSubject.complete()
    this.remoteQuerySyncSubject.complete()
    this.remoteQuerySyncIdSubject.complete()
    this.remoteRichLogootSOperationSubject.complete()
    this.remoteReplySyncSubject.complete()
  }

  handleRichLogootSOpMsg (content: RichLogootSOperationMsg): void {
    const richLogootSOp: RichLogootSOperation | null =
      this.deserializeRichLogootSOperation(content)

    this.remoteRichLogootSOperationSubject.next(richLogootSOp)
  }

  handleQuerySyncMsg (content: QuerySync): void {
    const vector: Map<number, number> = new Map()
    Object.keys(content.vector).forEach((key: string) => {
      const newKey = parseInt(key, 10)
      vector.set(newKey, content.vector[key])
    })
    this.remoteQuerySyncSubject.next(vector)
  }

  handleReplySyncMsg (content: ReplySync): void {
    const richLogootSOpsList = content.richLogootSOpsMsg
    const richLogootSOps: RichLogootSOperation[] = richLogootSOpsList.map((richLogootSOpMsg) => {
      return this.deserializeRichLogootSOperation(richLogootSOpMsg as RichLogootSOperationMsg)
    })

    const intervals: Interval[] = content.intervals.map((interval: IntervalMsg) => {
      return new Interval(interval.id, interval.begin, interval.end)
    })

    const replySyncEvent: ReplySyncEvent = new ReplySyncEvent(richLogootSOps, intervals)
    this.remoteReplySyncSubject.next(replySyncEvent)
  }

  generateRichLogootSOpMsg (richLogootSOp: RichLogootSOperation): Uint8Array {
    const richLogootSOperationMsg = this.serializeRichLogootSOperation(richLogootSOp)
    const msg = Sync.create({richLogootSOpMsg: richLogootSOperationMsg})
    return Sync.encode(msg).finish()
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
      logootSOp = LogootSAdd.fromPlain(logootSAddMsg)
    } else {
      const logootSDelMsg: LogootSDelMsg = content.logootSDelMsg as LogootSDelMsg
      logootSOp = LogootSDel.fromPlain(logootSDelMsg)
    }

    return new RichLogootSOperation(id, clock, logootSOp)
  }

  generateLogootSAddMsg (logootSAdd: LogootSAdd): LogootSAddMsg {
    const identifier = IdentifierMsg.create({base: logootSAdd.id.base, last: logootSAdd.id.last})
    return LogootSAddMsg.create({id: identifier, content: logootSAdd.content})
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

  generateQuerySyncMsg (vector: Map<number, number>): Uint8Array {
    const querySyncMsg = QuerySync.create()

    vector.forEach((clock: number, id: number) => {
      querySyncMsg.vector[id] = clock
    })

    const msg = Sync.create({querySync: querySyncMsg})

    return Sync.encode(msg).finish()
  }

  generateReplySyncMsg (richLogootSOps: RichLogootSOperation[], intervals: Interval[]): Uint8Array {
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

    return Sync.encode(msg).finish()
  }

}
