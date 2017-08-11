import { Interval } from './Interval'
import { RichLogootSOperation } from './RichLogootSOperation'

export class ReplySyncEvent {

  readonly richLogootSOps: RichLogootSOperation[]
  readonly intervals: Interval[]

  constructor (richLogootSOps: RichLogootSOperation[], intervals: Interval[]) {
    this.richLogootSOps = richLogootSOps
    this.intervals = intervals
  }

  equals (aOther: ReplySyncEvent) {
    return this.richLogootSOps.length === aOther.richLogootSOps.length &&
      this.intervals.length === aOther.intervals.length &&
      this.richLogootSOps.every((richLogootSOp: RichLogootSOperation, index: number): boolean => {
        const otherRichLogootSOp = aOther.richLogootSOps[index]
        return richLogootSOp.equals(otherRichLogootSOp)
      }) &&
      this.intervals.every((interval: Interval, index: number): boolean => {
        const otherInterval = aOther.intervals[index]
        return interval.equals(otherInterval)
      })
  }
}
