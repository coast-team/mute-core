import test from 'ava'

import { LogootSRopes, TextInsert } from 'mute-structs'
import { isUndefined } from 'util'
import { LSDocument } from '../src/crdtImpl/LogootSplit'

test('toto', (t) => {
  const a: LSDocument = new LSDocument(new LogootSRopes(1))
  const b: LSDocument = new LSDocument(new LogootSRopes(2))
  const c: LSDocument = new LSDocument(new LogootSRopes(3))

  let remoteA
  let remoteB
  let cpt = 0

  const result: object[][] = [
    [new TextInsert(0, 'l', 2)],
    [new TextInsert(0, 'He', 1), new TextInsert(3, 'lo', 1)],
  ]

  a.localOperations$.subscribe((v) => {
    remoteA = v
  })
  b.localOperations$.subscribe((v) => {
    remoteB = v
  })
  c.remoteOperationLog$.subscribe((v) => {
    t.deepEqual(v.textop, result[cpt])
    cpt++
  })
  a.handleLocalOperation([new TextInsert(0, 'Helo', 0)])
  if (isUndefined(remoteA)) {
    return
  }
  b.handleRemoteOperation(remoteA)
  b.handleLocalOperation([new TextInsert(2, 'l', 0)])
  if (isUndefined(remoteB)) {
    return
  }
  c.handleRemoteOperation(remoteB)
  c.handleRemoteOperation(remoteA)
})
