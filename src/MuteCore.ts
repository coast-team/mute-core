import { Observable } from 'rxjs/Observable'
import { merge } from 'rxjs/observable/merge'
import { Subject } from 'rxjs/Subject'

import { CollaboratorsService, ICollaborator } from './collaborators/'
import { Disposable } from './Disposable'
import { DocService } from './doc/'
import {
  BroadcastMessage,
  JoinEvent,
  MessageEmitter,
  NetworkMessage,
  SendRandomlyMessage,
  SendToMessage,
} from './network/'
import { collaborator as proto } from './proto'
import { SyncMessageService, SyncService } from './sync'
import { generateId } from './util'

export class MuteCore implements Disposable, MessageEmitter {
  readonly collaboratorsService: CollaboratorsService
  readonly docService: DocService
  readonly syncService: SyncService
  readonly syncMessageService: SyncMessageService

  private initSubject: Subject<string>

  constructor(me: proto.ICollaborator) {
    if (!me.muteCoreId) {
      me.muteCoreId = generateId()
    }
    console.log('generated id = ', me.muteCoreId)
    this.initSubject = new Subject<string>()

    this.collaboratorsService = new CollaboratorsService(Object.assign({ id: 0 }, me))
    this.docService = new DocService(me.muteCoreId)
    this.syncService = new SyncService(me.muteCoreId)
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

  set messageSource(source: Observable<NetworkMessage>) {
    this.collaboratorsService.messageSource = source
    this.syncMessageService.messageSource = source
  }

  get onInit(): Observable<string> {
    return this.initSubject.asObservable()
  }

  get onMsgToBroadcast(): Observable<BroadcastMessage> {
    return merge(
      this.collaboratorsService.onMsgToBroadcast,
      this.syncMessageService.onMsgToBroadcast
    )
  }

  get onMsgToSendRandomly(): Observable<SendRandomlyMessage> {
    return merge(
      this.collaboratorsService.onMsgToSendRandomly,
      this.syncMessageService.onMsgToSendRandomly
    )
  }

  get onMsgToSendTo(): Observable<SendToMessage> {
    return merge(this.collaboratorsService.onMsgToSendTo, this.syncMessageService.onMsgToSendTo)
  }

  init(key: string): void {
    this.initSubject.next(key)
  }

  dispose(): void {
    this.collaboratorsService.dispose()
    this.docService.dispose()
    this.syncService.dispose()
    this.syncMessageService.dispose()
  }
}
