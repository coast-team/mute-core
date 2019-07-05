import { StateVector, StateVectorOrder } from '../core'

export class PulsarCrdt {
  private id: number
  private state: StateVector
  private activatePulsar: boolean

  constructor(id: number, activatePulsar: boolean, vector?: Map<number, number>) {
    this.id = id
    this.activatePulsar = activatePulsar
    this.state = new StateVector(vector)
  }

  merge(other: PulsarCrdt) {
    const res = this.state.compareTo(other.state)
    if (res === StateVectorOrder.INFERIOR) {
      this.activatePulsar = other.activatePulsar
      this.state = other.state
    } else if (res === StateVectorOrder.CONCURRENT) {
      this.activatePulsar = this.activatePulsar && other.activatePulsar
      this.state.maxPairwise(other.state)
    }
  }

  setActivatePulsar(newActivatePulsar: boolean) {
    this.activatePulsar = newActivatePulsar
    const stateId = this.state.get(this.id)
    if (stateId !== undefined) {
      this.state.set(this.id, stateId + 1)
    } else {
      this.state.set(this.id, 0)
    }
  }

  getState(): object {
    return { activatePulsar: this.activatePulsar, vector: this.state.asMap(), id: this.id }
  }

  get isPulsarActivated(): boolean {
    return this.activatePulsar
  }
}
