import { Observable, Subject } from 'rxjs'
import { StateTypes } from '.'
import { CollaboratorsService } from '../collaborators'
import { DocService, State } from '../core'
import { IMessageIn, IMessageOut } from '../misc'
import { LSSync } from '../syncImpl'
import { LSDocService, LSDocument, LSState, LSSyncMessage } from './LogootSplit'
import { Strategy } from './Strategy'

export type DocServiceStrategyMethod<Seq, Op> = (
  strat: Strategy,
  messageIn$: Observable<IMessageIn>,
  messageOut$: Subject<IMessageOut>,
  id: number,
  state: StateTypes,
  collaboratorService: CollaboratorsService
) => DocService<Seq, Op>

export class DocServiceStrategy {
  static createDocService<Seq, Op>(
    strat: Strategy,
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    id: number,
    state: State<Seq, Op>,
    collaboratorService: CollaboratorsService
  ) {
    switch (strat) {
      case Strategy.LOGOOTSPLIT:
        if (state instanceof LSState) {
          const document = new LSDocument(state.sequenceCRDT)
          const sync = new LSSync(
            id,
            state.networkClock,
            state.vector,
            state.remoteOperations,
            collaboratorService
          )
          const syncMessage = new LSSyncMessage(messageIn$, messageOut$)
          return new LSDocService(id, collaboratorService, document, sync, syncMessage)
        } else {
          throw new Error('State is not an instanceof LSState')
        }
      default:
        throw new Error("This strategy doesn't exist")
    }
  }
}
