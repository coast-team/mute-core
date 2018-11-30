import { isDot, LogootSAdd, LogootSDel, LogootSOperation } from "mute-structs";
import { SafeAny } from "safe-any";
import { RichOperation } from "../../core";

export class LSRichOperation extends RichOperation<LogootSOperation> {
  static fromPlain (o: SafeAny<LSRichOperation>): LSRichOperation | null {
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
      const logootSAdd = LogootSAdd.fromPlain(o.operation)
      if (logootSAdd instanceof LogootSAdd) {
        return new LSRichOperation(o.id, o.clock, logootSAdd)
      }

      const logootSDel = LogootSDel.fromPlain(o.operation)
      if (logootSDel instanceof LogootSDel && o.dependencies.length > 0) {
        return new LSRichOperation(o.id, o.clock, logootSDel, new Map(o.dependencies))
      }
    }
    return null
  }

  equals (aOther: LSRichOperation): boolean {
    let areOpsEquals = false
    if (this.operation instanceof LogootSAdd && aOther.operation instanceof LogootSAdd) {
      areOpsEquals = this.operation.equals(aOther.operation)
    } else if (this.operation instanceof LogootSDel && aOther.operation instanceof LogootSDel) {
      areOpsEquals = this.operation.equals(aOther.operation)
    }
    return super.equals(aOther) && areOpsEquals
  }
}