import { LogootSOperation, LogootSRopes, TextOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { CollaboratorsService, ICollaborator } from './collaborators'
import { DocService, Position, State } from './core'
import { DocServiceStrategy, DocServiceStrategyMethod, StateTypes, Strategy } from './crdtImpl'
import { LSState } from './crdtImpl/LogootSplit'
import { FixDataState, LogState, MetaDataMessage, MetaDataService, TitleState } from './doc'
import { LocalOperation, RemoteOperation } from './logs'
import { Disposable, generateId, IMessageIn, IMessageOut } from './misc'
import { collaborator as proto } from './proto'

export type MuteCoreTypes = MuteCore<LogootSRopes, LogootSOperation>

export interface SessionParameters {
  strategy: Strategy
  profile: proto.ICollaborator
  docContent: StateTypes
  metaTitle: TitleState
  metaFixData: FixDataState
  metaLogs: LogState
}

export class MuteCore<Seq, Op> extends Disposable {
  public static mergeTitle(s1: TitleState, s2: TitleState): TitleState {
    return MetaDataService.mergeTitle(s1, s2)
  }

  public static mergeFixData(s1: FixDataState, s2: FixDataState): FixDataState {
    return MetaDataService.mergeFixData(s1, s2)
  }

  private collaboratorsService: CollaboratorsService
  private metaDataService: MetaDataService
  private docService: DocService<Seq, Op>

  private _messageOut$: Subject<IMessageOut>
  private _messageIn$: Subject<IMessageIn>

  constructor(
    { profile, strategy, docContent, metaTitle, metaFixData, metaLogs }: SessionParameters,
    docServiceMethod: DocServiceStrategyMethod<Seq, Op>
  ) {
    super()
    let muteCoreId: number
    if (docContent.id !== 0) {
      muteCoreId = docContent.id
      profile.muteCoreId = muteCoreId
    } else {
      muteCoreId = profile.muteCoreId || generateId()
      if (!profile.muteCoreId) {
        profile.muteCoreId = muteCoreId
      }
    }

    /* FIXME: this.me object doesn't have id property set to the correct network id (it is set to 0 just below).
      This is because the id is initialized once join() method is called.
    */
    this._messageOut$ = new Subject()
    this._messageIn$ = new Subject()

    // Initialize CollaboratorsService
    this.collaboratorsService = new CollaboratorsService(this._messageIn$, this._messageOut$, {
      id: 0,
      ...profile,
    } as ICollaborator)

    this.metaDataService = new MetaDataService(
      this._messageIn$,
      this._messageOut$,
      metaTitle,
      metaFixData,
      metaLogs,
      muteCoreId
    )

    this.docService = docServiceMethod(
      strategy,
      this._messageIn$,
      this._messageOut$,
      muteCoreId,
      docContent,
      this.collaboratorsService
    )

    // Subscription for logs
    // TODO
  }

  get myMuteCoreId(): number {
    return this.collaboratorsService.me.muteCoreId || 0
  }

  get state(): State<Seq, Op> {
    return this.docService.state
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
  get localOperationForLog$(): Observable<LocalOperation<Op>> {
    return this.docService.localOperationForLog$
  }

  get remoteOperationForLog(): Observable<RemoteOperation<Op>> {
    return this.docService.remoteOperationForLog$
  }

  /*
   * Doc observables
   */
  set localTextOperations$(source: Observable<TextOperation[]>) {
    this.docService.localTextOperations$ = source
  }

  get remoteTextOperations$(): Observable<{
    collaborator: ICollaborator | undefined
    operations: TextOperation[]
  }> {
    return this.docService.remoteTextOperations$
  }

  get digestUpdate$(): Observable<number> {
    return this.docService.digestUpdate$
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

  get collabLeave$(): Observable<ICollaborator> {
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
    this.docService.synchronize()
  }

  indexFromId(pos: any): number {
    return this.docService.indexFromId(pos)
  }

  positionFromIndex(index: number): Position | undefined {
    return this.docService.positionFromIndex(index)
  }
}

export class MuteCoreFactory {
  static createMuteCore(constructorParam: SessionParameters) {
    switch (constructorParam.strategy) {
      case Strategy.LOGOOTSPLIT:
        if (constructorParam.docContent instanceof LSState) {
          return new MuteCore<LogootSRopes, LogootSOperation>(
            constructorParam,
            DocServiceStrategy.createDocService
          )
        } else {
          throw new Error('')
        }
    }
  }
}
