import { Dot, isDot, LogootSAdd, LogootSDel, LogootSOperation } from 'mute-structs'
import { SafeAny } from 'safe-any'

import { ICollaborator } from '../collaborators'

export class RichLogootSOperation {
  static fromPlain(o: SafeAny<RichLogootSOperation>): RichLogootSOperation | null {
    if (
      typeof o === 'object' &&
      o !== null &&
      typeof o.id === 'number' &&
      Number.isInteger(o.id) &&
      typeof o.clock === 'number' &&
      Number.isInteger(o.clock) &&
      o.dependencies instanceof Array &&
      o.dependencies.every(isDot)
    ) {
      const logootSAdd = LogootSAdd.fromPlain(o.logootSOp)
      if (logootSAdd instanceof LogootSAdd) {
        return new RichLogootSOperation(o.id, o.clock, logootSAdd)
      }

      const logootSDel = LogootSDel.fromPlain(o.logootSOp)
      if (logootSDel instanceof LogootSDel && o.dependencies.length > 0) {
        return new RichLogootSOperation(o.id, o.clock, logootSDel, o.dependencies as Dot[])
      }
    }

    return null
  }

  readonly id: number
  readonly clock: number
  readonly logootSOp: LogootSOperation
  readonly dependencies: Dot[]
  public collab: ICollaborator | undefined

  constructor(id: number, clock: number, logootSOp: LogootSOperation, dependencies: Dot[] = []) {
    this.id = id
    this.clock = clock
    this.logootSOp = logootSOp
    this.dependencies = dependencies
  }

  equals(aOther: RichLogootSOperation): boolean {
    const result = this.id === aOther.id && this.clock === aOther.clock
    if (this.logootSOp instanceof LogootSAdd && aOther.logootSOp instanceof LogootSAdd) {
      return result && this.logootSOp.equals(aOther.logootSOp)
    } else if (this.logootSOp instanceof LogootSDel && aOther.logootSOp instanceof LogootSDel) {
      return (
        result &&
        this.logootSOp.equals(aOther.logootSOp) &&
        this.dependencies.every(({ replicaNumber, clock }, index) => {
          const { replicaNumber: rn, clock: c } = aOther.dependencies[index]
          return replicaNumber === rn && clock === c
        })
      )
    }
    return false
  }
}
