import { Observable, Observer, Subject, Subscription } from 'rxjs'
import { CollaboratorsService } from './collaborators/'
import { DocService } from './doc/'
import { BroadcastMessage, JoinEvent, MessageEmitter, NetworkMessage, SendRandomlyMessage, SendToMessage } from './network/'
import { SyncService, SyncMessageService } from './sync/'

export class MuteCore implements MessageEmitter {

  readonly collaboratorsService: CollaboratorsService
  readonly docService: DocService
  readonly syncService: SyncService
  readonly syncMessageService: SyncMessageService

  private initSubject: Subject<string>

  constructor (id: number) {
    this.initSubject = new Subject<string>()

    this.collaboratorsService = new CollaboratorsService()
    this.docService = new DocService(id)
    this.syncService = new SyncService(id)
    this.syncMessageService = new SyncMessageService()

    this.docService.initSource = this.initSubject
    this.docService.remoteLogootSOperationSource = this.syncService.onRemoteLogootSOperation

    this.syncService.localLogootSOperationSource = this.docService.onLocalLogootSOperation
    this.syncService.remoteQuerySyncSource = this.syncMessageService.onRemoteQuerySync
    this.syncService.remoteReplySyncSource = this.syncMessageService.onRemoteReplySync
    this.syncService.remoteRichLogootSOperationSource = this.syncMessageService.onRemoteRichLogootSOperation
    // this.syncService.storedStateSource = this.syncStorage.onStoredState

    this.syncMessageService.localRichLogootSOperationSource = this.syncService.onLocalRichLogootSOperation
    this.syncMessageService.querySyncSource = this.syncService.onQuerySync
    this.syncMessageService.replySyncSource = this.syncService.onReplySync
  }

  set messageSource (source: Observable<NetworkMessage>) {
    this.collaboratorsService.messageSource = source
    this.syncMessageService.messageSource = source
  }

  get onInit (): Observable<string> {
    return this.initSubject.asObservable()
  }

  get onMsgToBroadcast (): Observable<BroadcastMessage> {
    return Observable.merge(
      this.collaboratorsService.onMsgToBroadcast,
      this.syncMessageService.onMsgToBroadcast
    )
  }

  get onMsgToSendRandomly (): Observable<SendRandomlyMessage> {
    return Observable.merge(
      this.collaboratorsService.onMsgToSendRandomly,
      this.syncMessageService.onMsgToSendRandomly
    )
  }

  get onMsgToSendTo (): Observable<SendToMessage> {
    return Observable.merge(
      this.collaboratorsService.onMsgToSendTo,
      this.syncMessageService.onMsgToSendTo
    )
  }

  init (key: string): void {
    this.initSubject.next(key)
  }

  clean (): void {
    this.collaboratorsService.clean()
    this.docService.clean()
    this.syncService.clean()
    this.syncMessageService.clean()
  }
}
