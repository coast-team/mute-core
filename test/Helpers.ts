import {
    Identifier,
    IdentifierInterval,
    IdentifierTuple,
    LogootSAdd,
    LogootSDel,
} from 'mute-structs'

import {Disposable} from '../src/Disposable'
import {RichLogootSOperation, StateVector} from '../src/sync'

export function disposeOf (disposable: Disposable, time: number): void {
  setTimeout(() => {
    disposable.dispose()
  }, time)
}

export function generateRichLogootSOps (): RichLogootSOperation[] {
  const replicaNumber = 0
  const clock = 0
  const tuple1 = new IdentifierTuple(0, replicaNumber, clock, 0)
  const tuple2 = IdentifierTuple.generateWithSameBase(tuple1, 5)

  const id1 = new Identifier([tuple1])
  const insertOp1: LogootSAdd = new LogootSAdd(id1, 'hello')
  const richLogootSOp1 =
      new RichLogootSOperation(replicaNumber, clock, insertOp1)

  const id2 = new Identifier([tuple2])
  const insertOp2: LogootSAdd = new LogootSAdd(id2, ' world')
  const richLogootSOp2 =
      new RichLogootSOperation(replicaNumber, clock + 1, insertOp2)

  const id3 = Identifier.generateWithSameBase(id1, 3)
  const idInterval1 = new IdentifierInterval(id3, 7)
  const deleteOp1: LogootSDel = new LogootSDel([idInterval1])
  const richLogootSOp3 = new RichLogootSOperation(replicaNumber, clock + 2, deleteOp1)

  return [richLogootSOp1, richLogootSOp2, richLogootSOp3]
}

export function generateVector (): StateVector {
  const vector: Map<number, number> = new Map()
  vector.set(0, 42)
  vector.set(1, 10)
  vector.set(53, 1)

  return new StateVector(vector)
}
