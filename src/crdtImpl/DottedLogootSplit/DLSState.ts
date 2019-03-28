import { avl, EditableOpAvlList, SimpleDotBlockFactory, SimpleDotPos } from 'dotted-logootsplit'
import { OpEditableReplicatedList } from 'dotted-logootsplit/dist/types/core/op-replicated-list'
import { SafeAny } from 'safe-any'
import { State, StateJSON } from '../../core'
import { generateId } from '../../misc'
import { BlockOperation, DLSRichOperation, StringFromPlain } from './DLSRichOperation'

export class DLSState extends State<
  OpEditableReplicatedList<SimpleDotPos, string>,
  BlockOperation
> {
  static emptyState(): DLSState {
    const id = generateId()
    const seed = 'mute-core' + id
    return new DLSState(
      id,
      // tslint:disable-next-line:no-bitwise
      avl.opEditableList(SimpleDotBlockFactory.from(id >>> 0, seed), ''),
      [],
      new Map(),
      0
    )
  }

  static fromPlain(
    o: SafeAny<StateJSON<OpEditableReplicatedList<SimpleDotPos, string>, BlockOperation>>
  ): DLSState | null {
    if (o !== null && typeof o === 'object' && o.remoteOperations instanceof Array) {
      // If one operation is null -> error
      const dlsRichOperations = o.remoteOperations.map((richOp) => {
        return DLSRichOperation.fromPlain(richOp)
      }) as DLSRichOperation[]
      const nbOperationNull = dlsRichOperations.filter((r) => r === null).length
      if (nbOperationNull > 0) {
        return null
      }

      // If the vector and the logootsRopes are null -> v1 else v2
      if (this.isArray(o.vector) && o.sequenceCRDT && typeof o.sequenceCRDT === 'object') {
        const vector = new Map(o.vector)
        const opEditableList = EditableOpAvlList.fromPlain(
          SimpleDotBlockFactory,
          StringFromPlain.fromPlain
        )(o.sequenceCRDT)
        if (!opEditableList) {
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

        return new DLSState(id, opEditableList, dlsRichOperations, vector, networkClock)
      } else {
        // We create the state thanks to operations / we assume that operations are ordered
        const id = generateId()
        const seed = 'mute-core' + id
        const state = new DLSState(
          id,
          // tslint:disable-next-line:no-bitwise
          avl.opEditableList(SimpleDotBlockFactory.from(id >>> 0, seed), ''),
          [],
          new Map(),
          0
        )
        dlsRichOperations.forEach((richOp) => {
          state.vector.set(richOp.id, richOp.clock)
          state._sequenceCRDT.applyOp(richOp.operation)
        })
        return state
      }
    }
    return null
  }
}
