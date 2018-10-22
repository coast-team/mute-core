import test from 'ava'

import { LogootSRopes, TextInsert } from 'mute-structs'
import { isUndefined } from 'util'
import { Document } from '../src/doc'

test('toto', (t) => {
  const a: Document = new Document(new LogootSRopes(1))
  const b: Document = new Document(new LogootSRopes(2))
  const c: Document = new Document(new LogootSRopes(3))

  let remoteA
  let remoteB
  let cpt = 0

  const result: object[][] = [
    [new TextInsert(0, 'l')],
    [new TextInsert(0, 'He'), new TextInsert(3, 'lo')],
  ]

  a.localLogootSOperations$.subscribe((v) => {
    remoteA = v
  })
  b.localLogootSOperations$.subscribe((v) => {
    remoteB = v
  })
  c.remoteOperationLog$.subscribe((v) => {
    t.deepEqual(v.textop, result[cpt])
    cpt++
  })
  a.handleTextOperations([new TextInsert(0, 'Helo')])
  if (isUndefined(remoteA)) {
    return
  }
  b.handleRemoteOperation(remoteA)
  b.handleTextOperations([new TextInsert(2, 'l')])
  if (isUndefined(remoteB)) {
    return
  }
  c.handleRemoteOperation(remoteB)
  c.handleRemoteOperation(remoteA)
})
