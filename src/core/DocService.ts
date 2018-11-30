import { TextOperation } from 'mute-structs'
import { Observable } from 'rxjs'
import { CollaboratorsService, ICollaborator } from '../collaborators'
import { Document, Position } from './Document'
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
    id: number,
    collaboratorService: CollaboratorsService,
    document: Document<Seq, Op>,
    sync: Sync<Op>,
    syncMessage: SyncMessage<Op>
  ) {
    this.id = id
    this.collaboratorService = collaboratorService
    this.document = document
    this.sync = sync
    this.syncMsg = syncMessage

    this.document.remoteOperations$ = this.sync.remoteOperations$
    this.sync.localOperations$ = this.document.localOperations$
    this.sync.remoteQuerySync$ = this.syncMsg.remoteQuerySync$
    this.sync.remoteReplySync$ = this.syncMsg.remoteReplySync$
    this.sync.remoteRichOperations$ = this.syncMsg.remoteRichOperations$
    this.syncMsg.localRichOperations$ = this.sync.localRichOperations$
    this.syncMsg.querySync$ = this.sync.querySync$
    this.syncMsg.replySync$ = this.sync.replySync$
  }

  synchronize() {
    this.sync.sync()
  }

  indexFromId(pos: any): number {
    return this.document.indexFromId(pos)
  }

  positionFromIndex(index: number): Position | undefined {
    return this.document.positionFromIndex(index)
  }

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
