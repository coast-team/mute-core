import { StateVector, StateVectorOrder } from '../core'

export class LogCrdt {
  private id: number
  private state: StateVector
  private share: boolean

  constructor(id: number, share: boolean, vector?: Map<number, number>) {
    this.id = id
    this.share = share
    this.state = new StateVector(vector)
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
    const stateId = this.state.get(this.id)
    if (stateId !== undefined) {
      this.state.set(this.id, stateId + 1)
    } else {
      this.state.set(this.id, 0)
    }
  }

  getState(): object {
    return { share: this.share, vector: this.state.asMap(), id: this.id }
  }

  get isShared(): boolean {
    return this.share
  }
}
