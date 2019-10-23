import { Observable, Subject } from 'rxjs'
import { StateTypes } from '.'
import { CollaboratorsService } from '../collaborators'
import { DocService, State } from '../core'
import { IMessageIn, IMessageOut } from '../misc'
import { DLSSync, FIFODLSSync, LSSync, RLSSync } from '../syncImpl'
import { DLSDocService, DLSDocument, DLSState, DLSSyncMessage } from './DottedLogootSplit'
import {
  FIFODLSDocService,
  FIFODLSDocument,
  FIFODLSState,
  FIFODLSSyncMessage,
} from './FIFODottedLogootSplit'
import { LSDocService, LSDocument, LSState, LSSyncMessage } from './LogootSplit'
import { RLSDocService, RLSDocument, RLSState, RLSSyncMessage } from './RenamableLogootSplit'
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
  static createDocService(
    strat: Strategy,
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    id: number,
    state: LSState,
    collaboratorService: CollaboratorsService
  ): LSDocService
  static createDocService(
    strat: Strategy,
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    id: number,
    state: DLSState,
    collaboratorService: CollaboratorsService
  ): DLSDocService
  static createDocService(
    strat: Strategy,
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    id: number,
    state: FIFODLSState,
    collaboratorService: CollaboratorsService
  ): FIFODLSDocService
  static createDocService(
    strat: Strategy,
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    id: number,
    state: RLSState,
    collaboratorService: CollaboratorsService
  ): RLSDocService
  static createDocService<Seq, Op>(
    strat: Strategy,
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    id: number,
    state: State<Seq, Op>,
    collaboratorService: CollaboratorsService
  ): LSDocService | DLSDocService | FIFODLSDocService | RLSDocService {
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
      case Strategy.DOTTEDLOGOOTSPLIT:
        if (state instanceof DLSState) {
          const document = new DLSDocument(state.sequenceCRDT)
          const sync = new DLSSync(
            id,
            state.networkClock,
            state.vector,
            state.remoteOperations,
            collaboratorService
          )
          const syncMessage = new DLSSyncMessage(messageIn$, messageOut$)
          return new DLSDocService(id, collaboratorService, document, sync, syncMessage)
        } else {
          throw new Error('State is not an instanceof DLSState')
        }
      case Strategy.FIFODOTTEDLOGOOTSPLIT:
        if (state instanceof FIFODLSState) {
          const document = new FIFODLSDocument(state.sequenceCRDT)
          const sync = new FIFODLSSync(
            id,
            state.networkClock,
            state.vector,
            state.remoteOperations,
            collaboratorService
            )
            const syncMessage = new FIFODLSSyncMessage(messageIn$, messageOut$)
            return new FIFODLSDocService(id, collaboratorService, document, sync, syncMessage)
          } else {
            throw new Error('State is not an instanceof DLSState')
          }
      case Strategy.RENAMABLELOGOOTSPLIT:
        if (state instanceof RLSState) {
          const document = new RLSDocument(state.sequenceCRDT)
          const sync = new RLSSync(
            id,
            state.networkClock,
            state.vector,
            state.remoteOperations,
            collaboratorService,
            new Set()
          )
          const syncMessage = new RLSSyncMessage(messageIn$, messageOut$)
          return new RLSDocService(id, collaboratorService, document, sync, syncMessage)
        } else {
          throw new Error('State is not an instanceof RLSState')
        }
      default:
        throw new Error("This strategy doesn't exist")
    }
  }
}
