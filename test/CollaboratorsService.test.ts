import test from 'ava'
import { TestContext } from 'ava'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { CollaboratorsService, ICollaborator } from '../src/collaborators'
import { BroadcastMessage, NetworkMessage, SendToMessage } from '../src/network'

import { disposeOf } from './Helpers'

test('pseudos-correct-send-and-delivery', (t: TestContext) => {
  const expectedId = 42
  const collaboratorsServiceIn = new CollaboratorsService({ id: expectedId })
  disposeOf(collaboratorsServiceIn, 200)
  const collaboratorsServiceOut = new CollaboratorsService({ id: expectedId })
  disposeOf(collaboratorsServiceOut, 200)

  collaboratorsServiceOut.messageSource = collaboratorsServiceIn.onMsgToBroadcast.pipe(
    map((msg) => new NetworkMessage(msg.service, expectedId, true, msg.content))
  )

  const expectedUpdates = [
    { id: expectedId, displayName: 'Hello' },
    { id: expectedId, displayName: 'There,' },
    { id: expectedId, displayName: 'How' },
    { id: expectedId, displayName: 'Are' },
    { id: expectedId, displayName: 'You?' },
  ]
  setTimeout(() => (collaboratorsServiceIn.updateSource = from(expectedUpdates)), 0)

  t.plan((expectedUpdates.length - 1) * 2)
  let counter = 1
  return collaboratorsServiceOut.onUpdate.pipe(
    map((collaborator: ICollaborator): void => {
      const { displayName } = expectedUpdates[counter]
      t.is(collaborator.id, expectedId)
      t.is(collaborator.displayName, displayName)

      counter++
    })
  )
})

test('peers-joining-correct-delivery', (t: TestContext) => {
  const collaboratorsServiceIn = new CollaboratorsService({ id: 0 })
  disposeOf(collaboratorsServiceIn, 200)
  const collaboratorsServiceOut = new CollaboratorsService({ id: 0 })
  disposeOf(collaboratorsServiceOut, 200)

  let i = -1
  collaboratorsServiceOut.messageSource = collaboratorsServiceIn.onMsgToBroadcast.pipe(
    map((msg) => {
      i++
      return new NetworkMessage(msg.service, expectedIds[i].id, true, msg.content)
    })
  )

  const expectedIds = [{ id: 3 }, { id: 1 }, { id: 7 }, { id: 42 }, { id: 80 }]
  setTimeout(() => (collaboratorsServiceIn.updateSource = from(expectedIds)), 0)

  t.plan(expectedIds.length)
  let counter = 0
  return collaboratorsServiceOut.onJoin.pipe(
    map((collaborator: ICollaborator): void => {
      const { id } = expectedIds[counter]
      t.is(collaborator.id, id)

      counter++
    })
  )
})

test('send-pseudo-to-joining-peer', (t: TestContext) => {
  const collaboratorsService = new CollaboratorsService({ id: 0 })
  disposeOf(collaboratorsService, 200)

  const expectedId = 7
  setTimeout(() => {
    collaboratorsService.joinSource = from([expectedId])
  }, 0)

  t.plan(1)
  return collaboratorsService.onMsgToSendTo.pipe(
    map((msg: SendToMessage): void => {
      t.is(msg.id, expectedId)
    })
  )
})
