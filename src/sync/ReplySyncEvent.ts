import { Interval } from './Interval'
import { RichLogootSOperation } from './RichLogootSOperation'

export class ReplySyncEvent {
  readonly richLogootSOps: RichLogootSOperation[]
  readonly intervals: Interval[]

  constructor(richLogootSOps: RichLogootSOperation[], intervals: Interval[]) {
    this.richLogootSOps = richLogootSOps
    this.intervals = intervals
  }

  equals(aOther: ReplySyncEvent) {
    return (
      this.richLogootSOps.length === aOther.richLogootSOps.length &&
      this.intervals.length === aOther.intervals.length &&
      this.richLogootSOps.every((richLogootSOp, index) =>
        richLogootSOp.equals(aOther.richLogootSOps[index])
      ) &&
      this.intervals.every((interval, index) => interval.equals(aOther.intervals[index]))
    )
  }
}
