import { LogootSAdd, LogootSDel, LogootSOperation } from 'mute-structs'
import { Observable } from 'rxjs/Observable'
import { merge } from 'rxjs/observable/merge'
import { tap } from 'rxjs/operators'
import { Subject } from 'rxjs/Subject'
import { CollaboratorsService } from './collaborators/'
import { Disposable } from './Disposable'
import { DocService } from './doc/'
import { LocalOperation } from './logs/LocalOperation'
import { RemoteOperation } from './logs/RemoteOperation'
import {
  BroadcastMessage,
  JoinEvent,
  MessageEmitter,
  NetworkMessage,
  SendRandomlyMessage,
  SendToMessage,
} from './network/'
import { SyncMessageService, SyncService } from './sync/'

export class MuteCore implements Disposable, MessageEmitter {

  readonly collaboratorsService: CollaboratorsService
  readonly docService: DocService
  readonly syncService: SyncService
  readonly syncMessageService: SyncMessageService

  private initSubject: Subject<string>
  private localOperation: Subject<LocalOperation>
  private remoteOperation: Subject<RemoteOperation>

  constructor (id: number) {
    this.initSubject = new Subject<string>()

    this.collaboratorsService = new CollaboratorsService()
    this.docService = new DocService(id)
    this.syncService = new SyncService(id)
    this.syncMessageService = new SyncMessageService()

    this.docService.initSource = this.initSubject
    this.docService.remoteLogootSOperationSource = this.syncService.onRemoteLogootSOperation.pipe(
      tap((operations: LogootSOperation[]) => {
        operations.forEach((operation: LogootSOperation) => {
          this.logRemoteOperation(id, operation)
        })
      }),
    )

    this.syncService.localLogootSOperationSource = this.docService.onLocalLogootSOperation.pipe(
      tap((operation: LogootSOperation) => {
        this.logLocalOperation(id, operation)
      }),
    )
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
    return merge(
      this.collaboratorsService.onMsgToBroadcast,
      this.syncMessageService.onMsgToBroadcast,
    )
  }

  get onMsgToSendRandomly (): Observable<SendRandomlyMessage> {
    return merge(
      this.collaboratorsService.onMsgToSendRandomly,
      this.syncMessageService.onMsgToSendRandomly,
    )
  }

  get onMsgToSendTo (): Observable<SendToMessage> {
    return merge(
      this.collaboratorsService.onMsgToSendTo,
      this.syncMessageService.onMsgToSendTo,
    )
  }

  get onLocalOperation (): Observable<LocalOperation> {
    return this.localOperation.asObservable()
  }

  get onRemoteOperation (): Observable<RemoteOperation> {
    return this.remoteOperation.asObservable()
  }

  init (key: string): void {
    this.initSubject.next(key)
  }

  dispose (): void {
    this.collaboratorsService.dispose()
    this.docService.dispose()
    this.syncService.dispose()
    this.syncMessageService.dispose()
  }

  logLocalOperation (id: number, ope: LogootSOperation): void {
    if (ope instanceof LogootSAdd) {
      const o = ope as LogootSAdd
      this.localOperation.next({
        type: 'localInsertion',
        siteId: id,
        clock: this.syncService.getClock,
        operation: o,
        context: this.syncService.getVector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      this.localOperation.next({
        type: 'localDeletion',
        siteId: id,
        clock: this.syncService.getClock,
        operation: o,
        context: this.syncService.getVector,
      })
    }
  }

  logRemoteOperation (id: number, ope: LogootSOperation): void {
    if (ope instanceof LogootSAdd) {
      const o = ope as LogootSAdd
      this.remoteOperation.next({
        type: 'remoteInsertion',
        siteId: id,
        operation: o,
        context: this.syncService.getVector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      this.remoteOperation.next({
        type: 'remoteDeletion',
        siteId: id,
        operation: o,
        context: this.syncService.getVector,
      })
    }
  }
}
