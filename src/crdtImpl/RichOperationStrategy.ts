import { SafeAny } from 'safe-any'
import { RichOperation } from '../core'
import { LSRichOperation } from './LogootSplit'
import { Strategy } from './Strategy'

export type RichOperationTypes = LSRichOperation

interface IStateFactory<T> {
  fromPlain(o: any): T
}

function createRichOperation<T>(s: IStateFactory<T>, o: SafeAny): T | null {
  return s.fromPlain(o)
}

export class RichOperationStrategy {
  static fromPlain<Op>(strat: Strategy, o: SafeAny<RichOperation<Op>>) {
    let rop
    switch (strat) {
      case Strategy.LOGOOTSPLIT:
        rop = createRichOperation(LSRichOperation, o)
        break
      default:
        rop = null
        break
    }
    return rop
  }
}
