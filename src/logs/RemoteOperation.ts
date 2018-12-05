import { TextOperation } from 'mute-structs'

export interface RemoteOperation<Op> {
  readonly type: string
  readonly siteId: number
  readonly remoteSiteId: number
  readonly remoteClock: number
  readonly textOperation: TextOperation[]
  readonly operation: Op
  readonly context: Map<number, number>
}
