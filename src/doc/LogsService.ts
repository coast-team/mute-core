import { LogCrdt } from './LogCrdt'

export interface LogState {
  share: boolean
  vector?: Map<number, number>
}

export class LogsService {
  private crdt: LogCrdt

  constructor(id: number, state: LogState) {
    this.crdt = new LogCrdt(id, state)
  }

  public handleLocalLogState(share: boolean): void {
    this.crdt.setShare(share)
  }

  public handleRemoteLogState(otherCrdt: LogCrdt): void {
    this.crdt.merge(otherCrdt)
  }
}
