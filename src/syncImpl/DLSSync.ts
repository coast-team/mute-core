import { Sync } from '../core'
import { BlockOperation } from '../crdtImpl/DottedLogootSplit/DLSRichOperation'

export class DLSSync extends Sync<BlockOperation> {
  computeDependencies(operation: BlockOperation): Map<number, number> {
    const map = new Map()
    if (operation.isLengthBlock()) {
      const replicaNumber = operation.replica()
      map.set(replicaNumber, this.vector.get(replicaNumber))
    }
    return map
  }
}
