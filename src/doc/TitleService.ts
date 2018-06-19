import * as CRDT from 'delta-crdts'

export interface TitleState {
  count: number
  title: string
}

export class TitleService {
  private titleState: TitleState
  private register: any

  constructor(id: number) {
    this.register = CRDT('lwwreg')(id)
    this.titleState = this.register.state()
  }

  public handleLocalTitleState(newTitle: string): void {
    this.titleState = this.register.write(Date.now(), newTitle)
  }

  public handleRemoteTitleState(newState: TitleState): void {
    this.register.apply([newState.count, newState.title])
    this.titleState = this.register.state()
  }

  public initTitle(init: string): void {
    this.titleState[1] = init
  }

  get state(): TitleState {
    return this.titleState
  }

  get title(): string {
    return this.titleState[1]
  }

  get asObject(): object {
    return { count: this.titleState[0], title: this.titleState[1] }
  }
}
