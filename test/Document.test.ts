import test from 'ava'
import { LogootSRopes, TextDelete, TextInsert } from 'mute-structs'
import { from } from 'rxjs'
import { map } from 'rxjs/operators'

import { Document } from '../src/doc'

test('textOperation-correct-send-and-delivery', (context) => {
  const docIn = new Document(new LogootSRopes(0))
  const docOut = new Document(new LogootSRopes(1))
  const textOperations = [
    new TextInsert(0, 'Hello'),
    new TextInsert(5, ' world!'),
    new TextDelete(3, 4),
  ]

  docOut.remoteLogootSOperations$ = docIn.localLogootSOperations$.pipe(
    map((logootSOp) => ({ collaborator: undefined, operations: [logootSOp] }))
  )

  setTimeout(() => {
    docIn.localTextOperations$ = from(textOperations.map((textOp) => [textOp]))
    docIn.dispose()
    docOut.dispose()
  })

  let counter = 0
  context.plan(textOperations.length * 2)
  return docOut.remoteTextOperations$.pipe(
    map(
      ({ operations }): void => {
        // Each LogootSOperation should correspond to one TextOperation
        context.is(operations.length, 1)

        const actual = operations[0]
        const expected = textOperations[counter++]
        if (actual instanceof TextDelete && expected instanceof TextDelete) {
          context.true(actual.equals(expected))
        } else if (actual instanceof TextInsert && expected instanceof TextInsert) {
          context.true(actual.equals(expected))
        } else {
          context.fail('actual and expected must be of the same type')
        }
      }
    )
  )
})
