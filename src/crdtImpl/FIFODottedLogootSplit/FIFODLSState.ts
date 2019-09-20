import {
  avl,
  DeltaEditableReplicatedList,
  SimpleDotBlockFactory,
  SimpleDotPos,
} from 'dotted-logootsplit'
import { SafeAny } from 'safe-any'
import { State, StateJSON } from '../../core'
import { generateId } from '../../misc'
import { BlockOperation, FIFODLSRichOperation, StringFromPlain } from './FIFODLSRichOperation'

export class FIFODLSState extends State<
  DeltaEditableReplicatedList<SimpleDotPos, string>,
  BlockOperation
> {
  static emptyState(): FIFODLSState {
    const id = generateId()
    const seed = 'mute-core' + id
    return new FIFODLSState(
      id,
      // tslint:disable-next-line:no-bitwise
      avl.deltaEditableList(SimpleDotBlockFactory.from(id >>> 0, seed), ''),
      [],
      new Map(),
      0
    )
  }

  static fromPlain(
    o: SafeAny<StateJSON<DeltaEditableReplicatedList<SimpleDotPos, string>, BlockOperation>>
  ): FIFODLSState | null {
    if (o !== null && typeof o === 'object' && o.remoteOperations instanceof Array) {
      // If one operation is null -> error
      const dlsRichOperations = o.remoteOperations.map((richOp) => {
        return FIFODLSRichOperation.fromPlain(richOp)
      }) as FIFODLSRichOperation[]
      const nbOperationNull = dlsRichOperations.filter((r) => r === null).length
      if (nbOperationNull > 0) {
        return null
      }

      // If the vector and the logootsRopes are null -> v1 else v2
      if (this.isArray(o.vector) && o.sequenceCRDT && typeof o.sequenceCRDT === 'object') {
        const vector = new Map(o.vector)
        const deltaEditableList = avl.deltaEditableListFromPlain(
          SimpleDotBlockFactory,
          StringFromPlain.fromPlain
        )(o.sequenceCRDT)
        if (!deltaEditableList) {
          return null
        }

        let networkClock
        if (typeof o.networkClock === 'number' && Number.isInteger(o.networkClock)) {
          networkClock = o.networkClock
        } else {
          return null
        }

        let id
        if (typeof o.id === 'number' && Number.isInteger(o.id)) {
          id = o.id
        } else {
          return null
        }

        return new FIFODLSState(id, deltaEditableList, dlsRichOperations, vector, networkClock)
      } else {
        // We create the state thanks to operations / we assume that operations are ordered
        const id = generateId()
        const seed = 'mute-core' + id
        const state = new FIFODLSState(
          id,
          // tslint:disable-next-line:no-bitwise
          avl.deltaEditableList(SimpleDotBlockFactory.from(id >>> 0, seed), ''),
          [],
          new Map(),
          0
        )
        dlsRichOperations.forEach((richOp) => {
          state.vector.set(richOp.id, richOp.clock)
          state._sequenceCRDT.applyDelta(richOp.operation)
        })
        return state
      }
    }
    return null
  }
}
