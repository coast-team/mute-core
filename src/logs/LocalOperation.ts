import { LogootSOperation, TextOperation } from 'mute-structs'

export interface LocalOperation {
  readonly type: string
  readonly siteId: number
  readonly clock: number
  readonly textOperation: TextOperation
  readonly logootsOperation: LogootSOperation
  readonly context: Map<number, number>
}
