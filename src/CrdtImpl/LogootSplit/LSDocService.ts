import { LogootSOperation, LogootSRopes } from 'mute-structs'
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

  get state(): LSState {
    const { vector, richOperations, networkClock } = this.sync.stateElements
    return new LSState(this.id, this.document.doc, richOperations, vector, networkClock)
  }
}
