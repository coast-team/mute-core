import {
  LogootSRename,
  RenamableListOperation,
  RenamableLogootSAdd,
  RenamableLogootSDel,
} from 'mute-structs'
import { SafeAny } from 'safe-any'
import { RichOperation } from '../../core'

function isDependencyAsArray(o: unknown): o is [number, number] {
  return (
    Array.isArray(o) &&
    o.length === 2 &&
    typeof o[0] === 'number' &&
    Number.isSafeInteger(o[0]) &&
    typeof o[1] === 'number' &&
    Number.isSafeInteger(o[1])
  )
}

function isDependenciesAsArray(o: unknown): o is Array<[number, number]> {
  return Array.isArray(o) && o.every(isDependencyAsArray)
}

export class RLSRichOperation extends RichOperation<RenamableListOperation> {
  static fromPlain(o: SafeAny<RLSRichOperation>): RLSRichOperation | null {
    if (
      typeof o === 'object' &&
      o !== null &&
      typeof o.id === 'number' &&
      Number.isInteger(o.id) &&
      typeof o.clock === 'number' &&
      Number.isInteger(o.clock) &&
      isDependenciesAsArray(o.dependencies)
    ) {
      const dependencies = new Map(o.dependencies)

      const renamableLogootSAdd = RenamableLogootSAdd.fromPlain(o.operation)
      if (renamableLogootSAdd instanceof RenamableLogootSAdd) {
        return new RLSRichOperation(o.id, o.clock, renamableLogootSAdd, dependencies)
      }

      const renamableLogootSDel = RenamableLogootSDel.fromPlain(o.operation)
      if (renamableLogootSDel instanceof RenamableLogootSDel) {
        return new RLSRichOperation(o.id, o.clock, renamableLogootSDel, dependencies)
      }

      const logootSRename = LogootSRename.fromPlain(o.operation)
      if (logootSRename instanceof LogootSRename) {
        return new RLSRichOperation(o.id, o.clock, logootSRename, dependencies)
      }
    }

    return null
  }
}
