import {
  Block,
  ConcatLength,
  LengthBlock,
  SimpleDotBlockFactory,
  SimpleDotPos,
} from 'dotted-logootsplit'
import { SafeAny } from 'safe-any'
import { RichOperation } from '../../core'

export type BlockOperation = Block<SimpleDotPos, string> | LengthBlock<SimpleDotPos>

export class StringFromPlain {
  static fromPlain(x: unknown): string | undefined {
    if (typeof x === 'string') {
      return x
    }
    return undefined
  }
}

export class DLSRichOperation extends RichOperation<BlockOperation> {
  static fromPlain(o: SafeAny<DLSRichOperation>): DLSRichOperation | null {
    if (
      typeof o === 'object' &&
      o !== null &&
      typeof o.id === 'number' &&
      Number.isInteger(o.id) &&
      typeof o.clock === 'number' &&
      Number.isInteger(o.clock) &&
      o.operation &&
      typeof o.operation === 'object'
    ) {
      const blockOperation = SimpleDotBlockFactory.blockFromPlain(StringFromPlain.fromPlain)(
        o.operation
      )
      if (blockOperation) {
        return new DLSRichOperation(o.id, o.clock, blockOperation)
      }

      const lengthBlocBlockOperation = SimpleDotBlockFactory.blockFromPlain(ConcatLength.fromPlain)(
        o.operation
      )

      if (lengthBlocBlockOperation) {
        if (o.dependencies instanceof Map && o.dependencies.size > 0) {
          return new DLSRichOperation(
            o.id,
            o.clock,
            lengthBlocBlockOperation,
            new Map(o.dependencies)
          )
        } else {
          return new DLSRichOperation(o.id, o.clock, lengthBlocBlockOperation, new Map())
        }
      }
      return null
    }
    return null
  }
}
