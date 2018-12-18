import { LogootSAdd, LogootSDel, LogootSOperation } from 'mute-structs'
import { SafeAny } from 'safe-any'
import { RichOperation } from '../../core'

abstract class LSRichOperationV1 extends RichOperation<LogootSOperation> {
  static fromPlain(o: SafeAny<LSRichOperationV1>): LSRichOperation | null {
    if (
      typeof o === 'object' &&
      o !== null &&
      typeof o.id === 'number' &&
      Number.isInteger(o.id) &&
      typeof o.clock === 'number' &&
      Number.isInteger(o.clock)
    ) {
      const logootSAdd = LogootSAdd.fromPlain(o.logootSOp)
      if (logootSAdd instanceof LogootSAdd) {
        return new LSRichOperation(o.id, o.clock, logootSAdd)
      }

      const logootSDel = LogootSDel.fromPlain(o.logootSOp)
      if (logootSDel instanceof LogootSDel) {
        if (o.dependencies instanceof Array && o.dependencies.length > 0) {
          return new LSRichOperation(o.id, o.clock, logootSDel, new Map(o.dependencies))
        } else if (o.dependencies instanceof Map && o.dependencies.size > 0) {
          return new LSRichOperation(o.id, o.clock, logootSDel, o.dependencies)
        } else {
          return new LSRichOperation(o.id, o.clock, logootSDel, new Map())
        }
      }
    }
    return null
  }
  readonly logootSOp: LogootSOperation | undefined
}

export class LSRichOperation extends RichOperation<LogootSOperation> {
  static fromPlain(o: SafeAny<LSRichOperation>): LSRichOperation | null {
    if (
      typeof o === 'object' &&
      o !== null &&
      typeof o.id === 'number' &&
      Number.isInteger(o.id) &&
      typeof o.clock === 'number' &&
      Number.isInteger(o.clock)
    ) {
      const logootSAdd = LogootSAdd.fromPlain(o.operation)
      if (logootSAdd instanceof LogootSAdd) {
        return new LSRichOperation(o.id, o.clock, logootSAdd)
      }

      const logootSDel = LogootSDel.fromPlain(o.operation)
      if (logootSDel instanceof LogootSDel) {
        if (o.dependencies instanceof Array && o.dependencies.length > 0) {
          return new LSRichOperation(o.id, o.clock, logootSDel, new Map(o.dependencies))
        } else if (o.dependencies instanceof Map && o.dependencies.size > 0) {
          return new LSRichOperation(o.id, o.clock, logootSDel, o.dependencies)
        } else {
          return new LSRichOperation(o.id, o.clock, logootSDel, new Map())
        }
      }
    }
    return LSRichOperationV1.fromPlain(o as SafeAny<LSRichOperationV1>)
  }

  equals(aOther: LSRichOperation): boolean {
    let areOpsEquals = false
    if (this.operation instanceof LogootSAdd && aOther.operation instanceof LogootSAdd) {
      areOpsEquals = this.operation.equals(aOther.operation)
    } else if (this.operation instanceof LogootSDel && aOther.operation instanceof LogootSDel) {
      areOpsEquals = this.operation.equals(aOther.operation)
    }
    return super.equals(aOther) && areOpsEquals
  }
}
