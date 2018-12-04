export interface LocalOperation<Op> {
  readonly type: string
  readonly siteId: number
  readonly clock: number
  readonly position: number
  readonly content?: string
  readonly length?: number
  readonly operation: Op
  readonly context: Map<number, number>
}
