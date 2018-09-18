import { LogootSOperation } from 'mute-structs'

export interface LocalOperation {
  readonly type: string
  readonly siteId: number
  readonly clock: number
  readonly position: number
  readonly content?: string
  readonly length?: number
  readonly logootsOperation: LogootSOperation
  readonly context: Map<number, number>
}
