import { LogootSAdd, LogootSDel, LogootSOperation, TextOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { tap } from 'rxjs/operators'

import { CollaboratorsService, ICollaborator } from './collaborators'
import {
  Document,
  FixDataState,
  MetaDataMessage,
  MetaDataService,
  Position,
  TitleState,
} from './doc'
import { LocalOperation, RemoteOperation } from './logs'
import { Disposable, generateId, IMessageIn, IMessageOut } from './misc'
import { collaborator as proto } from './proto'
import { RichLogootSOperation, State, Sync, SyncMessageService } from './sync'

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
  private doc: Document
  private metaDataService: MetaDataService
  private sync: Sync
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

    // Initialize CollaboratorsService
    this.collaboratorsService = new CollaboratorsService(this._messageIn$, this._messageOut$, {
      id: 0,
      ...profile,
    } as ICollaborator)

    // Initialize document content and metadata with local values
    this.doc = new Document(profile.muteCoreId)
    this.metaDataService = new MetaDataService(
      this._messageIn$,
      this._messageOut$,
      metaTitle,
      metaFixData
    )

    // Initialize synchronization mechanism
    this.sync = new Sync(profile.muteCoreId, docContent, this.collaboratorsService)
    this.syncMessageService = new SyncMessageService(this._messageIn$, this._messageOut$)

    this.doc.remoteLogootSOperations$ = this.sync.remoteLogootSOperations$
    this.sync.localLogootSOperations$ = this.doc.localLogootSOperations$.pipe(
      tap((operation) => this.logLocalOperation(muteCoreId, operation))
    )
    this.sync.remoteQuerySync$ = this.syncMessageService.remoteQuerySync$
    this.sync.remoteReplySync$ = this.syncMessageService.remoteReplySync$
    this.sync.remoteRichLogootSOperations$ = this.syncMessageService.remoteRichLogootSOperations$.pipe(
      tap((operation) => this.logRemoteOperation(muteCoreId, operation))
    )
    this.syncMessageService.localRichLogootSOperations$ = this.sync.localRichLogootSOperations
    this.syncMessageService.querySync$ = this.sync.querySync$
    this.syncMessageService.replySync$ = this.sync.replySync$
  }

  get myMuteCoreId(): number {
    return this.collaboratorsService.me.muteCoreId || 0
  }

  get state(): State {
    return this.sync.state
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
   * Doc observables
   */
  set localTextOperations$(source: Observable<TextOperation[]>) {
    this.doc.localTextOperations$ = source
  }

  get remoteTextOperations$(): Observable<{
    collaborator: ICollaborator | undefined
    operations: TextOperation[]
  }> {
    return this.doc.remoteTextOperations$
  }

  get digestUpdate$(): Observable<number> {
    return this.doc.digest$
  }
  get treeUpdate$(): Observable<string> {
    return this.doc.tree$
  }

  /*
   * CollaboratorsService observables
   */
  get remoteCollabUpdate$(): Observable<ICollaborator> {
    return this.collaboratorsService.remoteUpdate$
  }

  set localCollabUpdate$(source: Observable<ICollaborator>) {
    this.collaboratorsService.localUpdate = source
  }

  get collabJoin$(): Observable<ICollaborator> {
    return this.collaboratorsService.join$
  }

  get collabLeave$(): Observable<number> {
    return this.collaboratorsService.leave$
  }

  set memberJoin$(source: Observable<number>) {
    this.collaboratorsService.memberJoin$ = source
    this.metaDataService.memberJoin$ = source
  }

  set memberLeave$(source: Observable<number>) {
    this.collaboratorsService.memberLeave$ = source
  }

  /*
   * MetaDataService observables
   */

  get remoteMetadataUpdate$(): Observable<MetaDataMessage> {
    return this.metaDataService.remoteUpdate$
  }

  set localMetadataUpdate$(source: Observable<MetaDataMessage>) {
    this.metaDataService.localUpdate$ = source
  }

  synchronize() {
    this.sync.sync()
  }

  indexFromId(pos: any): number {
    return this.doc.indexFromId(pos)
  }

  positionFromIndex(index: number): Position | undefined {
    return this.doc.positionFromIndex(index)
  }

  dispose() {
    this.collaboratorsService.dispose()
    this.doc.dispose()
    this.metaDataService.dispose()
    this.sync.dispose()
    this.syncMessageService.dispose()
  }

  logLocalOperation(id: number, ope: LogootSOperation) {
    if (ope instanceof LogootSAdd) {
      const o = ope as LogootSAdd
      this._localOperationForLog$.next({
        type: 'localInsertion',
        siteId: id,
        clock: this.sync.getClock,
        operation: o,
        context: this.sync.getVector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      this._localOperationForLog$.next({
        type: 'localDeletion',
        siteId: id,
        clock: this.sync.getClock,
        operation: o,
        context: this.sync.getVector,
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
        context: this.sync.getVector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      this._remoteOperationForLog.next({
        type: 'remoteDeletion',
        siteId: id,
        remoteSiteId: operation.id,
        remoteClock: operation.clock,
        operation: o,
        context: this.sync.getVector,
      })
    }
  }
}
