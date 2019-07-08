import { PulsarCrdt } from './PulsarCrdt'

export interface PulsarState {
  activatePulsar: boolean
}

export class Pulsar {
  private _id: number
  private crdt: PulsarCrdt

  constructor(id: number, state: PulsarState) {
    this._id = id
    this.crdt = new PulsarCrdt(id, state.activatePulsar)
  }

  public handleLocalPulsar(activatePulsar: boolean): void {
    this.crdt.setActivatePulsar(activatePulsar)
  }

  public handleRemotePulsar(id: number, other: PulsarState): PulsarState {
    const otherCrdt = new PulsarCrdt(id, other.activatePulsar)
    this.crdt.merge(otherCrdt)
    return this.state
  }
  get id() {
    return this._id
  }
  get state(): PulsarState {
    return this.crdt.getState() as PulsarState
  }
}
