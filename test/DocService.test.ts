import test from 'ava'
import {TestContext} from 'ava'
import {
    LogootSOperation,
    TextDelete,
    TextInsert,
    TextOperation,
} from 'mute-structs'
import {Observable, Subject} from 'rxjs'
import {from} from 'rxjs/observable/from'
import {map} from 'rxjs/operators'

import {DocService} from '../src/doc'

import {disposeOf} from './Helpers'

function generateTextOperations (): TextOperation[] {
  const textOperations: TextOperation[] = []

  textOperations.push(new TextInsert(0, 'Hello'))
  textOperations.push(new TextInsert(5, ' world!'))
  textOperations.push(new TextDelete(3, 4))

  return textOperations
}

test('textOperation-correct-send-and-delivery', (t: TestContext) => {
  const docServiceIn = new DocService(0)
  disposeOf(docServiceIn, 200)
  const docServiceOut = new DocService(1)
  disposeOf(docServiceOut, 200)

  const textOperations: TextOperation[] = generateTextOperations()
  const array: TextOperation[][] =
        textOperations.map((textOp: TextOperation) => [textOp])

  docServiceOut.remoteLogootSOperationSource =
        docServiceIn
            .onLocalLogootSOperation.pipe(
                map((logootSOp: LogootSOperation) => [logootSOp]),
            )

  setTimeout(() => {
    docServiceIn.localTextOperationsSource = from(array)
  }, 0)

  let counter = 0
  t.plan(textOperations.length * 2)
  return docServiceOut.onRemoteTextOperations.pipe(
    map((actualTextOperations: TextOperation[]): void => {
        // Each LogootSOperation should correspond to one TextOperation
      t.is(actualTextOperations.length, 1)

      const actual: TextOperation = actualTextOperations[0]
      const expected: TextOperation = textOperations[counter]
      if (actual instanceof TextDelete &&
            expected instanceof TextDelete) {

        t.true(actual.equals(expected))
      } else if (actual instanceof TextInsert &&
            expected instanceof TextInsert) {

        t.true(actual.equals(expected))
      } else {
        t.fail('actual and expected must be of the same type')
      }

      counter++
    }),
  )
})
