import {
  LogootSRename,
  RenamableListOperation,
  RenamableLogootSAdd,
  RenamableLogootSDel,
} from 'mute-structs'
import { CollaboratorsService } from '../collaborators'
import { RichOperation, Sync } from '../core'
import { RLSRichOperation } from '../crdtImpl/RenamableLogootSplit/RLSRichOperation'

export class RLSSync extends Sync<RenamableListOperation> {
  private epochDependencies: Set<[number, number]>

  constructor(
    id: number,
    networkClock: number,
    vector: Map<number, number>,
    richOps: Array<RichOperation<RenamableListOperation>>,
    collaboratorsService: CollaboratorsService,
    epochDependencies: Set<[number, number]>
  ) {
    super(id, networkClock, vector, richOps, collaboratorsService)
    this.epochDependencies = epochDependencies
  }

  computeDependencies(op: RenamableListOperation): Map<number, number> {
    const map = new Map()
    if (op instanceof LogootSRename) {
      this.vector.forEach((clock, replicaNumber) => {
        map.set(replicaNumber, clock)
      })
    } else if (op instanceof RenamableLogootSDel) {
      op.op.lid.forEach(({ idBegin: { replicaNumber } }) => {
        map.set(replicaNumber, this.vector.get(replicaNumber))
      })
      this.epochDependencies.forEach(([replicaNumber, clock]) => {
        map.set(replicaNumber, clock)
      })
    } else if (op instanceof RenamableLogootSAdd) {
      this.epochDependencies.forEach(([replicaNumber, clock]) => {
        map.set(replicaNumber, clock)
      })
    }
    return map
  }

  protected updateState(richOp: RLSRichOperation) {
    const { id, clock } = richOp
    this.vector.set(id, clock)
    this.richOperations.push(richOp)
    if (richOp.operation instanceof LogootSRename) {
      // If we are delivering a rename op, it means that this operation is
      //   - either causally dependant to known epochs
      //   - either concurrent to known epochs
      // In both cases, we add the new epoch
      const newDot: [number, number] = [richOp.id, richOp.clock]
      this.epochDependencies.forEach((dot) => {
        const [dotId, dotClock] = dot
        const newClock = richOp.dependencies.get(dotId)
        if (typeof newClock === 'number' && dotClock <= newClock) {
          // If an existing dot is dominated by the new one, can remove it
          this.epochDependencies.delete(dot)
        }
      })
      this.epochDependencies.add(newDot)
    }
  }
}
