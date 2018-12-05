import {
  LogootSAdd,
  LogootSDel,
  LogootSOperation,
  LogootSRopes,
  TextDelete,
  TextInsert,
  TextOperation,
} from 'mute-structs'
import { CollaboratorsService } from '../../collaborators'
import { DocService } from '../../core'
import { LSSync } from '../../syncImpl'
import { LSDocument } from './LSDocument'
import { LSState } from './LSState'
import { LSSyncMessage } from './LSSyncMessage'

export class LSDocService extends DocService<LogootSRopes, LogootSOperation> {
  constructor(
    id: number,
    collaboratorService: CollaboratorsService,
    document: LSDocument,
    sync: LSSync,
    syncMessage: LSSyncMessage
  ) {
    super(id, collaboratorService, document, sync, syncMessage)
  }

  logLocalOperation(id: number, textope: TextOperation, ope: LogootSOperation): void {
    if (ope instanceof LogootSAdd) {
      const o = ope as LogootSAdd
      const textoperation = textope as TextInsert
      this._localOperationForLog$.next({
        type: 'localInsertion',
        siteId: id,
        clock: this.sync.stateElements.networkClock,
        position: textoperation.index,
        content: textoperation.content,
        length: textoperation.content.length,
        operation: o,
        context: this.sync.stateElements.vector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      const textoperation = textope as TextDelete
      this._localOperationForLog$.next({
        type: 'localDeletion',
        siteId: id,
        clock: this.sync.stateElements.networkClock,
        position: textoperation.index,
        length: textoperation.length,
        operation: o,
        context: this.sync.stateElements.vector,
      })
    }
  }

  logRemoteOperation(
    id: number,
    texteope: TextOperation[],
    ope: LogootSOperation,
    clock: number,
    author: number
  ): void {
    if (ope instanceof LogootSAdd) {
      const o = ope as LogootSAdd
      this._remoteOperationForLog.next({
        type: 'remoteInsertion',
        siteId: id,
        remoteSiteId: author,
        remoteClock: clock,
        textOperation: texteope,
        operation: o,
        context: this.sync.stateElements.vector,
      })
    } else if (ope instanceof LogootSDel) {
      const o = ope as LogootSDel
      this._remoteOperationForLog.next({
        type: 'remoteDeletion',
        siteId: id,
        remoteSiteId: author,
        remoteClock: clock,
        textOperation: texteope,
        operation: o,
        context: this.sync.stateElements.vector,
      })
    }
  }

  get state(): LSState {
    const { vector, richOperations, networkClock } = this.sync.stateElements
    return new LSState(this.id, this.document.doc, richOperations, vector, networkClock)
  }
}
