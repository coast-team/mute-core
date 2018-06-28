export interface FixDataState {
  creationDate: Date
  key: string
}

export class FixDataService {
  private fixDataState: FixDataState

  constructor() {
    this.fixDataState = { creationDate: null, key: '' }
  }

  init(creationDate: Date, key: string): void {
    this.fixDataState = { creationDate, key }
  }

  public handleRemoteFixDataState(newState: FixDataState): void {
    if (!newState.creationDate) {
      return
    }

    if (newState.creationDate < this.fixDataState.creationDate) {
      this.fixDataState = newState
    }
  }

  get state(): FixDataState {
    return this.fixDataState
  }
}
