import test from 'ava'
import { CollaboratorMsg } from '../proto/collaborator_pb'
import { Identifier, LogootSAdd } from 'mute-structs'
import { RichLogootSOperation } from '../lib/sync/RichLogootSOperation'
import { SyncMessageService } from '../lib/sync/SyncMessageService'
import { CollaboratorsService } from '../lib/collaborators/CollaboratorsService'

test('InitMessageService', t => {
  const service = new SyncMessageService()
  t.truthy(service)
})

test('HandleRich', async t => {
  const service = new SyncMessageService()
  let id = new Identifier([14, 15], 43)
  let richMsg = service.serializeRichLogootSOperation(new RichLogootSOperation(12, 24, new LogootSAdd(id, 'a')))

  let val1 = service.handleRichLogootSOpMsg(richMsg)

  t.deepEqual(val1.logootSOp.content, richMsg.logootSAddMsg.content)
})

test('CollaboratorService', t => {
  const service = new CollaboratorsService()

  const val1 = service.emitPseudo('pseudo')

  t.deepEqual(CollaboratorMsg.decode(val1).pseudo, 'pseudo')
})
