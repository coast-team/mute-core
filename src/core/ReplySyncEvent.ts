import { Interval } from './Interval'
import { RichOperation } from './RichOperation'

export class ReplySyncEvent<Op> {
  readonly richOps: Array<RichOperation<Op>>
  readonly intervals: Interval[]

  constructor(richOps: Array<RichOperation<Op>>, intervals: Interval[]) {
    this.richOps = richOps
    this.intervals = intervals
  }

  equals(aOther: ReplySyncEvent<Op>) {
    return (
      this.richOps.length === aOther.richOps.length &&
      this.intervals.length === aOther.intervals.length &&
      this.richOps.every((richOps, index) => richOps.equals(aOther.richOps[index])) &&
      this.intervals.every((interval, index) => interval.equals(aOther.intervals[index]))
    )
  }
}
