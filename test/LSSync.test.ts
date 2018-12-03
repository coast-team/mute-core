import test from 'ava'
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { LogootSOperation } from 'mute-structs'
import { CollaboratorsService } from '../src/collaborators'
import { RichOperation } from '../src/core'
import { IMessageIn, IMessageOut } from '../src/misc'
import { LSSync } from '../src/syncImpl'
import { generateCausalRichLogootSOps, generateSequentialRichLogootSOps } from './LSHelpers'

test('deliver-operations-in-sequential-order', (context) => {
  const cs = new CollaboratorsService(new Subject<IMessageIn>(), new Subject<IMessageOut>(), {
    id: 0,
  })

  const richLogootSOps = generateSequentialRichLogootSOps()
  const [firstRichLogootSOp, ...tailRichLogootSOps] = richLogootSOps
  const sync = new LSSync(0, 0, new Map(), [], cs)

  const remoteRichLogootSOpSubject = new Subject<RichOperation<LogootSOperation>>()
  sync.remoteRichOperations$ = remoteRichLogootSOpSubject

  tailRichLogootSOps.forEach((op) => {
    remoteRichLogootSOpSubject.next(op)
  })
  setTimeout(() => {
    remoteRichLogootSOpSubject.next(firstRichLogootSOp)
    setTimeout(() => {
      cs.dispose()
      sync.dispose()
    }, 100)
  })

  let counter = 0
  context.plan(richLogootSOps.length * 2)
  return sync.remoteOperations$.pipe(
    map(({ operations }) => {
      context.is(operations.length, 1)
      context.deepEqual(operations, [richLogootSOps[counter++].operation])
    })
  )
})

test('deliver-operations-in-causal-order', (context) => {
  const cs = new CollaboratorsService(new Subject<IMessageIn>(), new Subject<IMessageOut>(), {
    id: 0,
  })
  const richLogootSOps = generateCausalRichLogootSOps()
  const [firstRichLogootSOp, secondRichLogootSOp] = richLogootSOps
  const sync = new LSSync(0, 0, new Map(), [], cs)

  const remoteRichLogootSOpSubject = new Subject<RichOperation<LogootSOperation>>()

  sync.remoteRichOperations$ = remoteRichLogootSOpSubject
  remoteRichLogootSOpSubject.next(secondRichLogootSOp)
  setTimeout(() => {
    remoteRichLogootSOpSubject.next(firstRichLogootSOp)
    setTimeout(() => {
      cs.dispose()
      sync.dispose()
    }, 100)
  })

  let counter = 0
  context.plan(richLogootSOps.length * 2)
  return sync.remoteOperations$.pipe(
    map(({ operations }) => {
      context.is(operations.length, 1)
      context.deepEqual(operations, [richLogootSOps[counter++].operation])
    })
  )
})
