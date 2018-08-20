import test from 'ava'
import { from, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { CollaboratorsService } from '../src/collaborators'
import { IMessageIn, IMessageOut } from '../src/misc/IMessage'

test('pseudos-correct-send-and-delivery', (context) => {
  const id = 42
  const msgOut1 = new Subject<IMessageOut>()
  const cs1 = new CollaboratorsService(new Subject<IMessageIn>(), msgOut1, { id })

  const cs2 = new CollaboratorsService(
    msgOut1.pipe(
      map((msg) => {
        const { recipientId, ...rest } = msg
        return { senderId: recipientId || 0, ...rest }
      })
    ),
    new Subject<IMessageOut>(),
    { id: 43 }
  )

  const expectedUpdates = [
    { id, displayName: 'Hello' },
    { id, displayName: 'There,' },
    { id, displayName: 'How' },
    { id, displayName: 'Are' },
    { id, displayName: 'You?' },
  ]
  setTimeout(() => {
    cs1.localUpdate = from(expectedUpdates)
    cs1.dispose()
    cs2.dispose()
  })

  context.plan((expectedUpdates.length - 1) * 2)
  let counter = 1
  return cs2.remoteUpdate$.pipe(
    map(({ id, displayName }) => {
      context.is(id, id)
      context.is(displayName, expectedUpdates[counter].displayName)
      counter++
    })
  )
})

test('peers-joining-correct-delivery', (context) => {
  const msgOut1 = new Subject<IMessageOut>()
  const cs1 = new CollaboratorsService(new Subject<IMessageIn>(), msgOut1, { id: 0 })

  const expectedIds = [{ id: 3 }, { id: 1 }, { id: 7 }, { id: 42 }, { id: 80 }]
  let i = -1
  const cs2 = new CollaboratorsService(
    msgOut1.pipe(
      map((msg) => {
        i++
        const { recipientId, ...rest } = msg
        return { senderId: expectedIds[i].id || 0, ...rest }
      })
    ),
    new Subject<IMessageOut>(),
    { id: 0 }
  )

  setTimeout(() => {
    cs1.localUpdate = from(expectedIds)
    cs1.dispose()
    cs2.dispose()
  })

  context.plan(expectedIds.length)
  let counter = 0
  return cs2.join$.pipe(map(({ id }) => context.is(id, expectedIds[counter++].id)))
})

test('send-pseudo-to-joining-peer', (context) => {
  const msgOut1 = new Subject<IMessageOut>()
  const cs1 = new CollaboratorsService(new Subject<IMessageIn>(), msgOut1, { id: 0 })

  const expectedId = 7
  setTimeout(() => {
    cs1.memberJoin$ = from([expectedId])
    cs1.dispose()
    msgOut1.complete()
  })

  context.plan(1)
  return msgOut1.pipe(map(({ recipientId: id }) => context.is(id, expectedId)))
})
