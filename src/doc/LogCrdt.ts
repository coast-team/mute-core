import { State, StateVector } from '../sync'
import { StateVectorOrder } from '../sync/StateVector'
import { LogState } from './LogsService'

export class LogCrdt {
  private id: number
  private state: StateVector
  private share: boolean

  constructor(id: number, state: LogState) {
    this.id = id
    this.share = state.share
    this.state = new StateVector(state.vector)
  }

  merge(other: LogCrdt) {
    const res = this.state.compareTo(other.state)
    if (res === StateVectorOrder.INFERIOR) {
      this.share = other.share
      this.state = other.state
    } else if (res === StateVectorOrder.CONCURRENT) {
      this.share = this.share && other.share
      this.state.maxPairwise(other.state)
    }
  }

  setShare(newShare: boolean) {
    this.share = newShare
    if (this.state.get(this.id)) {
      this.state.set(this.id, this.state.get(this.id) + 1)
    } else {
      this.state.set(this.id, 0)
    }
  }

  get isShared(): boolean {
    return this.share
  }
}
