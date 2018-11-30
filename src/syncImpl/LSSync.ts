import { LogootSDel, LogootSOperation } from "mute-structs";
import { Sync } from "../core";

export class LSSync extends Sync<LogootSOperation> {
  computeDependencies ({ lid }: LogootSDel): Map<number, number> {
    const map = new Map()
    lid.forEach(({ idBegin: { replicaNumber } }) => {
      map.set(replicaNumber, this.vector.get(replicaNumber))
    })
    return map
  }
}