import { Identifier, IdentifierInterval, LogootSDel, LogootSAdd } from 'mute-structs'
import { Observable, Subject, Subscription } from 'rxjs'

import { Interval } from './Interval'
import { BroadcastMessage, MessageEmitter, NetworkMessage, SendRandomlyMessage, SendToMessage } from '../network/'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'

const pb = require('../../proto/sync_pb.js')

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
      const msg: BroadcastMessage = new BroadcastMessage(SyncMessageService.ID, richLogootSOpMsg.serializeBinary())
      this.msgToBroadcastSubject.next(msg)
    })
  }

  set messageSource (source: Observable<NetworkMessage>) {
    this.messageSubscription = source
    .filter((msg: NetworkMessage) => msg.service === SyncMessageService.ID)
    .subscribe((msg: NetworkMessage) => {
      const content = new pb.Sync.deserializeBinary(msg.content)
      switch (content.getTypeCase()) {
        case pb.Sync.TypeCase.RICHLOGOOTSOP:
          this.handleRichLogootSOpMsg(content.getRichlogootsop())
          break
        case pb.Sync.TypeCase.QUERYSYNC:
          this.remoteQuerySyncIdSubject.next(msg.id) // Register the id of the peer
          this.handleQuerySyncMsg(content.getQuerysync())
          break
        case pb.Sync.TypeCase.REPLYSYNC:
          this.handleReplySyncMsg(content.getReplysync())
          break
      }
    })
  }

  set querySyncSource (source: Observable<Map<number, number>>) {
    this.querySyncSubscription = source.subscribe((vector: Map<number, number>) => {
      const querySyncMsg = this.generateQuerySyncMsg(vector)
      const msg: SendRandomlyMessage = new SendRandomlyMessage(SyncMessageService.ID, querySyncMsg.serializeBinary())
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
        const msg: SendToMessage = new SendToMessage(SyncMessageService.ID, id, replySyncMsg.serializeBinary())
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

  handleRichLogootSOpMsg (content: any): void {
    const richLogootSOp: RichLogootSOperation = this.deserializeRichLogootSOperation(content)

    this.remoteRichLogootSOperationSubject.next(richLogootSOp)
  }

  handleQuerySyncMsg (content: any): void {
    const vector: Map<number, number> = content.getVectorMap()
    this.remoteQuerySyncSubject.next(vector)
  }

  handleReplySyncMsg (content: any): void {
    const richLogootSOpsList: any[] = content.getRichlogootsopsList()
    const richLogootSOps: RichLogootSOperation[] = richLogootSOpsList.map((richLogootSOpMsg: any) => {
      return this.deserializeRichLogootSOperation(richLogootSOpMsg)
    })

    const intervals: Interval[] = content.getIntervalsList().map((interval: any) => {
      return new Interval(interval.getId(), interval.getBegin(), interval.getEnd())
    })

    const replySyncEvent: ReplySyncEvent = new ReplySyncEvent(richLogootSOps, intervals)
    this.remoteReplySyncSubject.next(replySyncEvent)
  }

  generateRichLogootSOpMsg (richLogootSOp: RichLogootSOperation): any {
    const richLogootSOperationMsg = this.serializeRichLogootSOperation(richLogootSOp)
    const msg = new pb.Sync()
    msg.setRichlogootsop(richLogootSOperationMsg)

    return msg
  }

  serializeRichLogootSOperation (richLogootSOp: RichLogootSOperation): any {
    const richLogootSOperationMsg = new pb.RichLogootSOperation()
    richLogootSOperationMsg.setId(richLogootSOp.id)
    richLogootSOperationMsg.setClock(richLogootSOp.clock)

    const logootSOp: LogootSAdd | LogootSDel = richLogootSOp.logootSOp
    if (logootSOp instanceof LogootSAdd) {
      richLogootSOperationMsg.setLogootsadd(this.generateLogootSAddMsg(logootSOp))
    } else if (logootSOp instanceof LogootSDel) {
      richLogootSOperationMsg.setLogootsdel(this.generateLogootSDelMsg(logootSOp))
    }

    return richLogootSOperationMsg
  }

  deserializeRichLogootSOperation (content: any): RichLogootSOperation {
    const id: number = content.getId()
    const clock: number = content.getClock()

    let logootSOp: LogootSAdd | LogootSDel
    if (content.hasLogootsadd()) {
      const logootSAddMsg = content.getLogootsadd()
      const identifier: Identifier = new Identifier(logootSAddMsg.getId().getBaseList(), logootSAddMsg.getId().getLast())
      logootSOp = new LogootSAdd(identifier, logootSAddMsg.getContent())
    } else {
      const logootSDelMsg: any = content.getLogootsdel()
      const lid: any = logootSDelMsg.getLidList().map( (identifier: any) => {
        return new IdentifierInterval(identifier.getBaseList(), identifier.getBegin(), identifier.getEnd())
      })
      logootSOp = new LogootSDel(lid)
    }

    return new RichLogootSOperation(id, clock, logootSOp)
  }

  generateLogootSAddMsg (logootSAdd: LogootSAdd): any {
    const identifier = new pb.Identifier()

    identifier.setBaseList(logootSAdd.id.base)
    identifier.setLast(logootSAdd.id.last)

    const logootSAddMsg = new pb.LogootSAdd()
    logootSAddMsg.setId(identifier)
    logootSAddMsg.setContent(logootSAdd.l)

    return logootSAddMsg
  }

  generateLogootSDelMsg (logootSDel: LogootSDel): any {
    const lid: any[] = logootSDel.lid.map( (id: any) => {
      const identifierInterval: any = this.generateIdentifierIntervalMsg(id)
      return identifierInterval
    })

    const logootSDelMsg = new pb.LogootSDel()
    logootSDelMsg.setLidList(lid)
    return logootSDelMsg
  }

  generateIdentifierIntervalMsg (id: IdentifierInterval): any {
    const identifierIntervalMsg = new pb.IdentifierInterval()

    identifierIntervalMsg.setBaseList(id.base)
    identifierIntervalMsg.setBegin(id.begin)
    identifierIntervalMsg.setEnd(id.end)

    return identifierIntervalMsg
  }

  generateQuerySyncMsg (vector: Map<number, number>): any {
    const querySyncMsg = new pb.QuerySync()

    const map: Map<number, number> = querySyncMsg.getVectorMap()
    vector.forEach((clock: number, id: number) => {
      map.set(id, clock)
    })

    const msg = new pb.Sync()
    msg.setQuerysync(querySyncMsg)

    return msg
  }

  generateReplySyncMsg (richLogootSOps: RichLogootSOperation[], intervals: Interval[]): any {
    const replySyncMsg = new pb.ReplySync()

    replySyncMsg.setRichlogootsopsList(richLogootSOps.map((richLogootSOp: RichLogootSOperation) => {
      return this.serializeRichLogootSOperation(richLogootSOp)
    }))

    const intervalsMsg = intervals.map((interval: Interval) => {
      const intervalMsg = new pb.Interval()
      intervalMsg.setId(interval.id)
      intervalMsg.setBegin(interval.begin)
      intervalMsg.setEnd(interval.end)
      return intervalMsg
    })
    replySyncMsg.setIntervalsList(intervalsMsg)

    const msg = new pb.Sync()
    msg.setReplysync(replySyncMsg)

    return msg
  }

}
