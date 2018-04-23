import { LogootSOperation } from 'mute-structs'

export interface RemoteOperation {
  readonly type: string
  readonly siteId: number
  readonly operation: LogootSOperation
  readonly context: Map<number, number>
}
