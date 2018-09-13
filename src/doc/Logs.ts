import { LogCrdt } from './LogCrdt'

export interface LogState {
  share: boolean
  vector?: Map<number, number>
}

export class Logs {
  private _id: number
  private crdt: LogCrdt

  constructor(id: number, state: LogState) {
    this._id = id
    this.crdt = new LogCrdt(id, state.share, state.vector)
  }

  public handleLocalLogState(share: boolean): void {
    this.crdt.setShare(share)
  }

  public handleRemoteLogState(id: number, other: LogState): LogState {
    const otherCrdt = new LogCrdt(id, other.share, other.vector)
    this.crdt.merge(otherCrdt)
    return this.state
  }

  get id() {
    return this._id
  }

  get state(): LogState {
    return this.crdt.getState() as LogState
  }

  get stateWithVectorAsArray() {
    const state = this.state
    const vectorAsMap = state.vector || new Map<number, number>()
    const vectorAsArray = Array.from(vectorAsMap)
    return { share: state.share, vector: vectorAsArray }
  }
}
