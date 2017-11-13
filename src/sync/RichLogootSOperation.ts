import { LogootSAdd, LogootSDel, LogootSOperation } from 'mute-structs'
import { SafeAny } from 'safe-any'

export class RichLogootSOperation {

  static fromPlain (o: SafeAny<RichLogootSOperation>): RichLogootSOperation | null {
    if (typeof o === 'object' && o !== null &&
        typeof o.id === 'number' && Number.isInteger(o.id) &&
        typeof o.clock === 'number' && Number.isInteger(o.clock)) {

      const logootSAdd: LogootSAdd | null = LogootSAdd.fromPlain(o.logootSOp)
      if (logootSAdd instanceof LogootSAdd) {
        return new RichLogootSOperation(o.id, o.clock, logootSAdd)
      }

      const logootSDel: LogootSDel | null = LogootSDel.fromPlain(o.logootSOp)
      if (logootSDel instanceof LogootSDel) {
        return new RichLogootSOperation(o.id, o.clock, logootSDel)
      }
    }

    return null
  }

  readonly id: number
  readonly clock: number
  readonly logootSOp: LogootSOperation

  constructor (id: number, clock: number, logootSOp: LogootSOperation) {
    this.id = id
    this.clock = clock
    this.logootSOp = logootSOp
  }

  equals (aOther: RichLogootSOperation): boolean {
    const result: boolean = this.id === aOther.id && this.clock === aOther.clock
    if (this.logootSOp instanceof LogootSAdd &&
      aOther.logootSOp instanceof LogootSAdd) {

      return result && this.logootSOp.equals(aOther.logootSOp)
    } else if (this.logootSOp instanceof LogootSDel &&
      aOther.logootSOp instanceof LogootSDel) {

      return result && this.logootSOp.equals(aOther.logootSOp)
    }
    return false
  }
}
