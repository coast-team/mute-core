export interface FixDataState {
  docCreated: number
  cryptoKey: string
}

export class FixData {
  static merge(state1: FixDataState, state2: FixDataState): FixDataState {
    const finalState = state1.docCreated < state2.docCreated ? state1 : state2
    return { docCreated: finalState.docCreated, cryptoKey: finalState.cryptoKey }
  }
  private _state: FixDataState

  constructor(state: FixDataState) {
    this._state = state
  }

  public handleRemoteFixDataState(newState: FixDataState): FixDataState {
    this._state = FixData.merge(this._state, newState)
    return this._state
  }

  get state(): FixDataState {
    return this._state
  }
}
