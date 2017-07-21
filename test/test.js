import test from 'ava'
import { Identifier, LogootSAdd } from 'mute-structs'
import { RichLogootSOperation } from '../lib/sync/RichLogootSOperation'
import { SyncMessageService } from '../lib/sync/SyncMessageService'
import { OldSyncMessageService } from '../lib/sync/OldSyncMessageService'
import { CollaboratorsService } from '../lib/collaborators/CollaboratorsService'
import { OldCollaboratorsService } from '../lib/collaborators/OldCollaboratorsService'
import { CollaboratorMsg } from '../proto/collaborator'
const pb = require('../proto/collaborator_pb.js')

test('InitMessageService', t => {
  const service = new SyncMessageService()
  const oldService = new OldSyncMessageService()
  t.truthy(service && oldService)
})

test('HandleRich', async t => {
  const service = new SyncMessageService()
  const oldService = new OldSyncMessageService()
  let id = new Identifier([14, 15], 43)
  let richMsg = service.serializeRichLogootSOperation(new RichLogootSOperation(12, 24, new LogootSAdd(id, 'a')))
  let oldRichMsg = oldService.serializeRichLogootSOperation(new RichLogootSOperation(12, 24, new LogootSAdd(id, 'a')))

  let val1 = service.handleRichLogootSOpMsg(richMsg)
  let val2 = oldService.handleRichLogootSOpMsg(oldRichMsg)

  t.deepEqual(val1, val2)
})

test('CollaboratorService', t => {
  const service = new CollaboratorsService()
  const oldService = new OldCollaboratorsService()

  const val1 = service.emitPseudo('pseudo')
  const val2 = oldService.emitPseudo('pseudo')
  const val3 = new pb.Collaborator.deserializeBinary(val2)

  t.deepEqual(CollaboratorMsg.decode(val1).pseudo, val3.getPseudo())
})
