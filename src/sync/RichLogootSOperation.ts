import { Dot, IdentifierInterval, LogootSAdd, LogootSDel, LogootSOperation } from 'mute-structs'
import { SafeAny } from 'safe-any'

export class RichLogootSOperation {

  static fromPlain (o: SafeAny<RichLogootSOperation>): RichLogootSOperation | null {
    if (typeof o === 'object' && o !== null &&
        typeof o.id === 'number' && Number.isInteger(o.id) &&
        typeof o.clock === 'number' && Number.isInteger(o.clock) &&
        o.dependencies instanceof Array &&
        o.dependencies.every((dot: SafeAny<Dot>) => o instanceof Dot)
      ) {

      const logootSAdd: LogootSAdd | null = LogootSAdd.fromPlain(o.logootSOp)
      if (logootSAdd instanceof LogootSAdd) {
        return new RichLogootSOperation(o.id, o.clock, logootSAdd)
      }

      const logootSDel: LogootSDel | null = LogootSDel.fromPlain(o.logootSOp)
      if (logootSDel instanceof LogootSDel && o.dependencies.length > 0) {
        return new RichLogootSOperation(o.id, o.clock, logootSDel, o.dependencies)
      }
    }

    return null
  }

  readonly id: number
  readonly clock: number
  readonly logootSOp: LogootSOperation
  readonly dependencies: Dot[]

  constructor (id: number, clock: number, logootSOp: LogootSOperation, dependencies: Dot[] = []) {
    this.id = id
    this.clock = clock
    this.logootSOp = logootSOp
    this.dependencies = dependencies
  }

  equals (aOther: RichLogootSOperation): boolean {
    const result: boolean = this.id === aOther.id && this.clock === aOther.clock
    if (this.logootSOp instanceof LogootSAdd &&
      aOther.logootSOp instanceof LogootSAdd) {

      return result && this.logootSOp.equals(aOther.logootSOp)
    } else if (this.logootSOp instanceof LogootSDel &&
      aOther.logootSOp instanceof LogootSDel) {

      return result && this.logootSOp.equals(aOther.logootSOp) &&
        this.dependencies.every((dependency: Dot, index: number) => {
          const otherDependency: Dot = aOther.dependencies[index]
          return dependency.replicaNumber === otherDependency.replicaNumber &&
            dependency.clock === otherDependency.clock
        })
    }
    return false
  }
}
