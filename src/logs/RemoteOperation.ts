import { LogootSOperation, TextOperation } from 'mute-structs'

export interface RemoteOperation {
  readonly type: string
  readonly siteId: number
  readonly remoteSiteId: number
  readonly remoteClock: number
  readonly textOperation: TextOperation[]
  readonly logootsOperation: LogootSOperation
  readonly context: Map<number, number>
}
