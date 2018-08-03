import { LogootSAdd, LogootSDel, LogootSOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'

import { CollaboratorsService } from './collaborators'
import { Disposable } from './Disposable'
import { DocService } from './doc'
import { FixDataState } from './doc/FixDataService'
import { MetaDataService } from './doc/MetaDataService'
import { TitleState } from './doc/TitleService'
import { LocalOperation } from './logs/LocalOperation'
import { RemoteOperation } from './logs/RemoteOperation'
import { IMessageIn, IMessageOut } from './network'
import { collaborator as proto } from './proto'
import { RichLogootSOperation, SyncMessageService, SyncService } from './sync'
import { generateId } from './util'

export interface SessionParameters {
  profile: proto.ICollaborator
  metaTitle: TitleState
  metaFixData: FixDataState
}

export class MuteCore extends Disposable {
  readonly collaboratorsService: CollaboratorsService
  readonly docService: DocService
  readonly metaDataService: MetaDataService
  readonly syncService: SyncService
  readonly syncMessageService: SyncMessageService

  private localOperation: Subject<LocalOperation>
  private remoteOperation: Subject<RemoteOperation>
  private _messageOut: Subject<IMessageOut>
  private _messageIn: Subject<IMessageIn>

  constructor({ profile, metaTitle, metaFixData }: SessionParameters) {
    super()
    const muteCoreId = profile.muteCoreId || generateId()
    if (!profile.muteCoreId) {
      profile.muteCoreId = muteCoreId
    }

    /* FIXME: this.me object doesn't have id property set to the correct network id (it is set to 0 just below).
      This is because the id is initialized once join() method is called.
    */
    this._messageOut = new Subject()
    this._messageIn = new Subject()
    this.localOperation = new Subject()
    this.remoteOperation = new Subject()

    this.collaboratorsService = new CollaboratorsService(
      this._messageIn,
      this._messageOut,
      Object.assign({ id: 0 }, profile)
    )
    this.docService = new DocService(profile.muteCoreId)
    this.metaDataService = new MetaDataService(
      this._messageIn,
      this._messageOut,
      metaTitle,
      metaFixData
    )
    this.syncService = new SyncService(profile.muteCoreId, this.collaboratorsService)
    this.syncMessageService = new SyncMessageService(this._messageIn, this._messageOut)

    this.docService.remoteLogootSOperationSource = this.syncService.onRemoteLogootSOperation

    this.syncService.localLogootSOperationSource = this.docService.onLocalLogootSOperation.pipe(
      tap((operation: LogootSOperation) => {
        this.logLocalOperation(muteCoreId, operation)
      })
    )
    this.syncService.remoteQuerySyncSource = this.syncMessageService.onRemoteQuerySync
    this.syncService.remoteReplySyncSource = this.syncMessageService.onRemoteReplySync
    this.syncService.remoteRichLogootSOperationSource = this.syncMessageService.onRemoteRichLogootSOperation.pipe(
      tap((operation: RichLogootSOperation) => {
        this.logRemoteOperation(muteCoreId, operation)
      })
    )
    // this.syncService.storedStateSource = this.syncStorage.onStoredState

    this.syncMessageService.localRichLogootSOperationSource = this.syncService.onLocalRichLogootSOperation
    this.syncMessageService.querySyncSource = this.syncService.onQuerySync
    this.syncMessageService.replySyncSource = this.syncService.onReplySync
  }

  set messageIn(source: Observable<IMessageIn>) {
    this.newSub = source.subscribe((msg) => this._messageIn.next(msg))
  }

  get messageOut(): Observable<IMessageOut> {
    return this._messageOut.asObservable()
  }

  get onLocalOperation(): Observable<LocalOperation> {
    return this.localOperation.asObservable()
  }

  get onRemoteOperation(): Observable<RemoteOperation> {
    return this.remoteOperation.asObservable()
  }

  dispose() {
    this.collaboratorsService.dispose()
    this.docService.dispose()
    this.metaDataService.dispose()
    this.syncService.dispose()
    this.syncMessageService.dispose()
  }

  logLocalOperation(id: number, ope: LogootSOperation) {
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

  logRemoteOperation(id: number, operation: RichLogootSOperation) {
    const ope = operation.logootSOp
    if (ope instanceof LogootSAdd) {
      const o = ope as LogootSAdd
      this.remoteOperation.next({
        type: 'remoteInsertion',
        siteId: id,
        remoteSiteId: operation.id,
        remoteClock: operation.clock,
        operation: o,
        context: this.syncService.getVector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      this.remoteOperation.next({
        type: 'remoteDeletion',
        siteId: id,
        remoteSiteId: operation.id,
        remoteClock: operation.clock,
        operation: o,
        context: this.syncService.getVector,
      })
    }
  }
}
