export interface TitleState {
  titleModified: number // Date of the last modification (remote or local)
  title: string
}

export class Title {
  static merge(state1: TitleState, state2: TitleState): TitleState {
    const finalState = state1.titleModified > state2.titleModified ? state1 : state2
    return { title: finalState.title, titleModified: finalState.titleModified }
  }

  private _state: TitleState

  constructor(state: TitleState) {
    this._state = state
  }

  public handleLocalState(newState: TitleState) {
    this._state = Title.merge(this._state, newState)
  }

  public handleRemoteState(newState: TitleState): TitleState {
    this._state = Title.merge(this._state, newState)
    return this._state
  }

  get state(): TitleState | undefined {
    return this._state
  }
}
