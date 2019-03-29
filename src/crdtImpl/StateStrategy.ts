import { SafeAny } from 'safe-any'
import { StateJSON } from '../core'
import { DLSState } from './DottedLogootSplit'
import { LSState } from './LogootSplit/LSState'
import { Strategy } from './Strategy'

export type StateTypes = LSState | DLSState

interface IStateFactory<T> {
  fromPlain(o: any): T
  emptyState(): T
}

function createState<T>(s: IStateFactory<T>, o: SafeAny): T | null {
  return s.fromPlain(o)
}

function createEmptyState<T>(s: IStateFactory<T>): T | null {
  return s.emptyState()
}

export class StateStrategy {
  static fromPlain<Seq, Op>(strat: Strategy, o: SafeAny<StateJSON<Seq, Op>>) {
    let state
    switch (strat) {
      case Strategy.LOGOOTSPLIT:
        state = createState(LSState, o)
        break
      case Strategy.DOTTEDLOGOOTSPLIT:
        state = createState(DLSState, o)
        break
      default:
        state = null
        break
    }
    return state
  }

  static emptyState(strat: Strategy) {
    let state
    switch (strat) {
      case Strategy.LOGOOTSPLIT:
        state = createEmptyState(LSState)
        break
      case Strategy.DOTTEDLOGOOTSPLIT:
        state = createEmptyState(DLSState)
        break
      default:
        state = null
        break
    }
    return state
  }

  static getStr(state: StateTypes): string | undefined {
    if (state instanceof LSState) {
      return state.sequenceCRDT.str
    } else if (state instanceof DLSState) {
      return state.sequenceCRDT.concatenated('')
    } else {
      return undefined
    }
  }
}
