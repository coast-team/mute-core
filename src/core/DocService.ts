import { TextOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { CollaboratorsService, ICollaborator } from '../collaborators'
import { IMessageIn, IMessageOut } from '../misc'
import { Document } from './Document'
import { RichOperation } from './RichOperation'
import { State } from './State'
import { Sync } from './Sync'
import { SyncMessage } from './SyncMessage'

export abstract class DocService<Seq, Op> {
  protected document: Document<Seq, Op>
  protected sync: Sync<Op>
  protected syncMsg: SyncMessage<Op>

  protected id: number
  protected collaboratorService: CollaboratorsService

  constructor(
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    id: number,
    state: State<Seq, Op>,
    collaboratorService: CollaboratorsService
  ) {
    this.id = id
    this.collaboratorService = collaboratorService
    this.document = this.concreteDocument(state.sequenceCRDT)
    this.sync = this.concreteSync(
      id,
      state.networkClock,
      state.vector,
      state.remoteOperations,
      collaboratorService
    )
    this.syncMsg = this.concreteSyncMessage(messageIn$, messageOut$)

    this.document.remoteOperations$ = this.sync.remoteOperations$
    this.sync.localOperations$ = this.document.localOperations$
    this.sync.remoteQuerySync$ = this.syncMsg.remoteQuerySync$
    this.sync.remoteReplySync$ = this.syncMsg.remoteReplySync$
    this.sync.remoteRichOperations$ = this.syncMsg.remoteRichOperations$
    this.syncMsg.localRichOperations$ = this.sync.localRichOperations$
    this.syncMsg.querySync$ = this.sync.querySync$
    this.syncMsg.replySync$ = this.sync.replySync$
  }

  protected abstract concreteDocument(sequenceCRDT: Seq): Document<Seq, Op>
  protected abstract concreteSync(
    id: number,
    networkClock: number,
    vector: Map<number, number>,
    rOps: Array<RichOperation<Op>>,
    collaboratorsService: CollaboratorsService
  ): Sync<Op>
  protected abstract concreteSyncMessage(
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>
  ): SyncMessage<Op>

  abstract get state(): State<Seq, Op>

  set localTextOperations$(source: Observable<TextOperation[]>) {
    this.document.localTextOperations$ = source
  }

  get remoteTextOperations$(): Observable<{
    collaborator: ICollaborator | undefined
    operations: TextOperation[]
  }> {
    return this.document.remoteTextOperations$
  }

  get digestUpdate$(): Observable<number> {
    return this.document.digest$
  }
}
