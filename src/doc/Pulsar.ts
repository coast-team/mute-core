import { PulsarCrdt } from './PulsarCrdt'

export interface PulsarState {
  activatePulsar: boolean
  vector?: Map<number, number>
}

export class Pulsar {
  private _id: number
  private crdt: PulsarCrdt

  constructor(id: number, state: PulsarState) {
    this._id = id
    this.crdt = new PulsarCrdt(id, state.activatePulsar, state.vector)
  }

  public handleLocalPulsar(activatePulsar: boolean): void {
    this.crdt.setActivatePulsar(activatePulsar)
  }

  public handleRemotePulsar(id: number, other: PulsarState): PulsarState {
    const otherCrdt = new PulsarCrdt(id, other.activatePulsar, other.vector)
    this.crdt.merge(otherCrdt)
    return this.state
  }
  get id() {
    return this._id
  }
  get state(): PulsarState {
    return this.crdt.getState() as PulsarState
  }

  get stateWithVectorsAsArray() {
    const state = this.state
    const vectorAsMap = state.vector || new Map<number, number>()
    const vectorAsArray = Array.from(vectorAsMap)
    return { activatePulsar: state.activatePulsar, vector: vectorAsArray }
  }
}
