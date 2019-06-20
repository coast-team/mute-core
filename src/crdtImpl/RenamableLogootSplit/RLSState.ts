import { RenamableListOperation, RenamableReplicableList } from 'mute-structs'
import { SafeAny } from 'safe-any'
import { State, StateJSON } from '../../core'
import { generateId } from '../../misc'
import { RLSRichOperation } from './RLSRichOperation'

function isEntryAsArray(o: unknown): o is [number, number] {
  return (
    Array.isArray(o) &&
    o.length === 2 &&
    typeof o[0] === 'number' &&
    Number.isSafeInteger(o[0]) &&
    typeof o[1] === 'number' &&
    Number.isSafeInteger(o[1])
  )
}

function isVectorAsArray(o: unknown): o is Array<[number, number]> {
  return Array.isArray(o) && o.every(isEntryAsArray)
}

export class RLSState extends State<RenamableReplicableList, RenamableListOperation> {
  static emptyState(): RLSState {
    const id = generateId()
    return new RLSState(id, RenamableReplicableList.create(id), [], new Map(), 0)
  }

  static fromPlain(
    o: SafeAny<StateJSON<RenamableReplicableList, RenamableListOperation>>
  ): RLSState | null {
    if (
      typeof o === 'object' &&
      o !== null &&
      typeof o.sequenceCRDT === 'object' &&
      o.sequenceCRDT !== null &&
      isVectorAsArray(o.vector) &&
      Array.isArray(o.remoteOperations) &&
      typeof o.id === 'number' &&
      Number.isInteger(o.id) &&
      typeof o.networkClock === 'number' &&
      Number.isInteger(o.networkClock)
    ) {
      const sequenceCRDT = RenamableReplicableList.fromPlain(o.sequenceCRDT)
      const remoteOperations = o.remoteOperations
        .map((richOp) => {
          return RLSRichOperation.fromPlain(richOp)
        })
        .filter((v): v is RLSRichOperation => v !== null)
      const vector = new Map(o.vector)

      if (sequenceCRDT !== null && remoteOperations.length === o.remoteOperations.length) {
        return new RLSState(o.id, sequenceCRDT, remoteOperations, vector, o.networkClock)
      }
    }

    return null
  }
}
