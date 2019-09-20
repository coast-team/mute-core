import { Sync } from '../core'
import { BlockOperation } from '../crdtImpl/FIFODottedLogootSplit/FIFODLSRichOperation'

export class FIFODLSSync extends Sync<BlockOperation> {
  computeDependencies(_operation: BlockOperation): Map<number, number> {
    return new Map()
  }
}
