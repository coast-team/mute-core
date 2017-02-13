import { Observable, Observer, Subscription } from 'rxjs'
import { CollaboratorsService } from './collaborators/'
import { DocService } from './doc/'
import { BroadcastMessage, JoinEvent, MessageEmitter, NetworkMessage, SendRandomlyMessage, SendToMessage } from './network/'
import { SyncService, SyncMessageService } from './sync/'

export class MuteCore implements MessageEmitter {

  readonly collaboratorsService: CollaboratorsService
  readonly docService: DocService
  readonly syncService: SyncService
  readonly syncMessageService: SyncMessageService

  constructor (id: number) {
    this.collaboratorsService = new CollaboratorsService()
    this.docService = new DocService()
    this.syncService = new SyncService()
    this.syncMessageService = new SyncMessageService()

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

  set joinSource (source: Observable<JoinEvent>) {
    this.docService.joinSource = source
  }

  set messageSource (source: Observable<NetworkMessage>) {
    source.subscribe((msg: NetworkMessage) => { console.log('received msg: ', msg) })
    this.collaboratorsService.messageSource = source
    this.syncMessageService.messageSource = source
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

  clean (): void {
    this.collaboratorsService.clean()
    this.docService.clean()
    this.syncService.clean()
    this.syncMessageService.clean()
  }
}
