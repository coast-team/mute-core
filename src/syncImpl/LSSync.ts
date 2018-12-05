import { LogootSDel, LogootSOperation } from 'mute-structs'
import { Sync } from '../core'

export class LSSync extends Sync<LogootSOperation> {
  computeDependencies(op: LogootSOperation): Map<number, number> {
    const map = new Map()
    if (op instanceof LogootSDel) {
      op.lid.forEach(({ idBegin: { replicaNumber } }) => {
        map.set(replicaNumber, this.vector.get(replicaNumber))
      })
    }
    return map
  }
}
