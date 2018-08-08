import { LogootSAdd, LogootSDel, LogootSOperation, TextOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'

import { CollaboratorsService, ICollaborator } from './collaborators'
import {
  DocService,
  FixDataState,
  MetaDataMessage,
  MetaDataService,
  Position,
  TitleState,
} from './doc'
import { LocalOperation, RemoteOperation } from './logs'
import { Disposable, generateId, IMessageIn, IMessageOut } from './misc'
import { collaborator as proto } from './proto/index'
import { RichLogootSOperation, State, SyncMessageService, SyncService } from './sync'

export interface SessionParameters {
  profile: proto.ICollaborator
  docContent: State
  metaTitle: TitleState
  metaFixData: FixDataState
}

export class MuteCore extends Disposable {
  public static mergeTitle(s1: TitleState, s2: TitleState): TitleState {
    return MetaDataService.mergeTitle(s1, s2)
  }

  public static mergeFixData(s1: FixDataState, s2: FixDataState): FixDataState {
    return MetaDataService.mergeFixData(s1, s2)
  }

  private collaboratorsService: CollaboratorsService
  private docService: DocService
  private metaDataService: MetaDataService
  private syncService: SyncService
  private syncMessageService: SyncMessageService

  private _localOperationForLog$: Subject<LocalOperation>
  private _remoteOperationForLog: Subject<RemoteOperation>
  private _messageOut$: Subject<IMessageOut>
  private _messageIn$: Subject<IMessageIn>

  constructor({ profile, docContent, metaTitle, metaFixData }: SessionParameters) {
    super()
    const muteCoreId = profile.muteCoreId || generateId()
    if (!profile.muteCoreId) {
      profile.muteCoreId = muteCoreId
    }

    /* FIXME: this.me object doesn't have id property set to the correct network id (it is set to 0 just below).
      This is because the id is initialized once join() method is called.
    */
    this._messageOut$ = new Subject()
    this._messageIn$ = new Subject()
    this._localOperationForLog$ = new Subject()
    this._remoteOperationForLog = new Subject()

    this.collaboratorsService = new CollaboratorsService(
      this._messageIn$,
      this._messageOut$,
      Object.assign({ id: 0 }, profile)
    )
    this.docService = new DocService(profile.muteCoreId)
    this.metaDataService = new MetaDataService(
      this._messageIn$,
      this._messageOut$,
      metaTitle,
      metaFixData
    )
    this.syncService = new SyncService(profile.muteCoreId, docContent, this.collaboratorsService)
    this.syncMessageService = new SyncMessageService(this._messageIn$, this._messageOut$)

    this.docService.remoteLogootSOperationSource = this.syncService.onRemoteLogootSOperation

    this.syncService.localLogootSOperationSource = this.docService.onLocalLogootSOperation.pipe(
      tap((operation) => this.logLocalOperation(muteCoreId, operation))
    )
    this.syncService.remoteQuerySyncSource = this.syncMessageService.onRemoteQuerySync
    this.syncService.remoteReplySyncSource = this.syncMessageService.onRemoteReplySync
    this.syncService.remoteRichLogootSOperationSource = this.syncMessageService.onRemoteRichLogootSOperation.pipe(
      tap((operation) => this.logRemoteOperation(muteCoreId, operation))
    )
    // this.syncService.storedStateSource = this.syncStorage.onStoredState

    this.syncMessageService.localRichLogootSOperationSource = this.syncService.onLocalRichLogootSOperation
    this.syncMessageService.querySyncSource = this.syncService.onQuerySync
    this.syncMessageService.replySyncSource = this.syncService.onReplySync
  }

  get myMuteCoreId(): number {
    return this.collaboratorsService.me.muteCoreId || 0
  }

  get state(): State {
    return this.syncService.state
  }

  set messageIn$(source: Observable<IMessageIn>) {
    this.newSub = source.subscribe((msg) => this._messageIn$.next(msg))
  }

  get messageOut$(): Observable<IMessageOut> {
    return this._messageOut$.asObservable()
  }

  /*
   * Observables for logging
   */
  get localOperationForLog$(): Observable<LocalOperation> {
    return this._localOperationForLog$.asObservable()
  }

  get remoteOperationForLog(): Observable<RemoteOperation> {
    return this._remoteOperationForLog.asObservable()
  }

  /*
   * DocService observables
   */
  set localTextOperations$(source: Observable<TextOperation[]>) {
    this.docService.localTextOperationsSource = source
  }

  get remoteTextOperations$(): Observable<{
    collaborator: ICollaborator | undefined
    operations: TextOperation[]
  }> {
    return this.docService.onRemoteTextOperations
  }

  get digestUpdate$(): Observable<number> {
    return this.docService.onDocDigest
  }
  get treeUpdate$(): Observable<string> {
    return this.docService.onDocTree
  }

  /*
   * CollaboratorsService observables
   */
  get remoteCollabUpdate$(): Observable<ICollaborator> {
    return this.collaboratorsService.onUpdate
  }

  set localCollabUpdate$(source: Observable<ICollaborator>) {
    this.collaboratorsService.updateSource = source
  }

  get collabJoin$(): Observable<ICollaborator> {
    return this.collaboratorsService.onJoin
  }

  get collabLeave$(): Observable<number> {
    return this.collaboratorsService.onLeave
  }

  set memberJoin$(source: Observable<number>) {
    this.collaboratorsService.joinSource = source
    this.metaDataService.joinSource = source
  }

  set memberLeave$(source: Observable<number>) {
    this.collaboratorsService.leaveSource = source
  }

  /*
   * MetaDataService observables
   */

  get remoteMetadataUpdate$(): Observable<MetaDataMessage> {
    return this.metaDataService.onChange
  }

  set localMetadataUpdate$(source: Observable<MetaDataMessage>) {
    this.metaDataService.onLocalChange = source
  }

  sync() {
    this.syncService.sync()
  }

  indexFromId(pos: any): number {
    return this.docService.indexFromId(pos)
  }

  positionFromIndex(index: number): Position | undefined {
    return this.docService.positionFromIndex(index)
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
      this._localOperationForLog$.next({
        type: 'localInsertion',
        siteId: id,
        clock: this.syncService.getClock,
        operation: o,
        context: this.syncService.getVector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      this._localOperationForLog$.next({
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
      this._remoteOperationForLog.next({
        type: 'remoteInsertion',
        siteId: id,
        remoteSiteId: operation.id,
        remoteClock: operation.clock,
        operation: o,
        context: this.syncService.getVector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      this._remoteOperationForLog.next({
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
