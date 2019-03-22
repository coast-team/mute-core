import { SimpleDotPos } from 'dotted-logootsplit'
import { OpEditableReplicatedList } from 'dotted-logootsplit/dist/types/core/op-replicated-list'
import { TextDelete, TextInsert, TextOperation } from 'mute-structs'
import { CollaboratorsService } from '../../collaborators'
import { DocService } from '../../core'
import { DLSSync } from '../../syncImpl'
import { DLSDocument } from './DLSDocument'
import { BlockOperation } from './DLSRichOperation'
import { DLSState } from './DLSState'
import { DLSSyncMessage } from './DLSSyncMessage'

export class DLSDocService extends DocService<
  OpEditableReplicatedList<SimpleDotPos, string>,
  BlockOperation
> {
  constructor(
    id: number,
    collaboratorService: CollaboratorsService,
    document: DLSDocument,
    sync: DLSSync,
    syncMessage: DLSSyncMessage
  ) {
    super(id, collaboratorService, document, sync, syncMessage)
  }

  logLocalOperation(id: number, textope: TextOperation, ope: BlockOperation): void {
    if (ope.isLengthBlock()) {
      const textoperation = textope as TextDelete
      this._localOperationForLog$.next({
        type: 'localDeletion',
        siteId: id,
        clock: this.sync.stateElements.networkClock,
        position: textoperation.index,
        length: textoperation.length,
        operation: ope,
        context: this.sync.stateElements.vector,
      })
    } else {
      const textoperation = textope as TextInsert
      this._localOperationForLog$.next({
        type: 'localInsertion',
        siteId: id,
        clock: this.sync.stateElements.networkClock,
        position: textoperation.index,
        content: textoperation.content,
        length: textoperation.content.length,
        operation: ope,
        context: this.sync.stateElements.vector,
      })
    }
  }

  logRemoteOperation(
    id: number,
    texteope: TextOperation[],
    ope: BlockOperation,
    clock: number,
    author: number
  ): void {
    if (ope.isLengthBlock()) {
      this._remoteOperationForLog.next({
        type: 'remoteDeletion',
        siteId: id,
        remoteSiteId: author,
        remoteClock: clock,
        textOperation: texteope,
        operation: ope,
        context: this.sync.stateElements.vector,
      })
    } else {
      this._remoteOperationForLog.next({
        type: 'remoteInsertion',
        siteId: id,
        remoteSiteId: author,
        remoteClock: clock,
        textOperation: texteope,
        operation: ope,
        context: this.sync.stateElements.vector,
      })
    }
  }

  get state(): DLSState {
    const { vector, richOperations, networkClock } = this.sync.stateElements
    return new DLSState(this.id, this.document.doc, richOperations, vector, networkClock)
  }
}
