import { Sync } from '../core'

export class FIFOSync<Op> extends Sync<Op> {
  computeDependencies(_operation: Op): Map<number, number> {
    return new Map()
  }
}
