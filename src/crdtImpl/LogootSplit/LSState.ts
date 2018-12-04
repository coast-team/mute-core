import { LogootSOperation, LogootSRopes } from 'mute-structs'
import { SafeAny } from 'safe-any'
import { State, StateJSON } from '../../core'
import { generateId } from '../../misc'
import { LSRichOperation } from './LSRichOperation'

export class LSState extends State<LogootSRopes, LogootSOperation> {
  static emptyState(): LSState {
    const id = generateId()
    return new LSState(id, new LogootSRopes(id), [], new Map(), 0)
  }

  static fromPlain(o: SafeAny<StateJSON<LogootSRopes, LogootSOperation>>): LSState | null {
    if (o !== null && typeof o === 'object' && o.remoteOperations instanceof Array) {
      // If one operation is null -> error
      const lsRichOperations = o.remoteOperations.map((richOp) => {
        return LSRichOperation.fromPlain(richOp)
      }) as LSRichOperation[]
      const nbOperationNull = lsRichOperations.filter((r) => r === null).length
      if (nbOperationNull > 0) {
        return null
      }

      // If the vector and the logootsRopes are null -> v1 else v2
      if (
        this.isArray(o.vector) &&
        o.sequenceCRDT &&
        typeof o.sequenceCRDT === 'object' &&
        typeof o.sequenceCRDT.replicaNumber === 'number' &&
        Number.isInteger(o.sequenceCRDT.replicaNumber) &&
        typeof o.sequenceCRDT.clock === 'number'
      ) {
        const vector = new Map(o.vector)
        const logootsRopes = LogootSRopes.fromPlain(
          o.sequenceCRDT.replicaNumber,
          o.sequenceCRDT.clock,
          o.sequenceCRDT
        )
        if (!logootsRopes) {
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

        return new LSState(id, logootsRopes, lsRichOperations, vector, networkClock)
      } else {
        // We create the state thanks to operations / we assume that operations are ordered
        const state = new LSState(0, new LogootSRopes(), [], new Map(), 0)
        lsRichOperations.forEach((richOp) => {
          state.vector.set(richOp.id, richOp.clock)
          richOp.operation.execute(state._sequenceCRDT)
        })
        return state
      }
    }
    return null
  }
}
