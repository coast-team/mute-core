import { LogootSOperation } from 'mute-structs'

export interface LocalOperation {
  readonly type: string
  readonly siteId: number
  readonly clock: number
  readonly operation: LogootSOperation
  readonly context: Map<number, number>
}
