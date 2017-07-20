import test from 'ava'
import { Identifier, LogootSAdd } from 'mute-structs'
import { RichLogootSOperation } from '../lib/sync/RichLogootSOperation'
import { SyncMessageService } from '../lib/sync/SyncMessageService'
import { OldSyncMessageService } from '../lib/sync/OldSyncMessageService'

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

test.skip('HandleQuery', async t => {
  const service = new SyncMessageService()
  const oldService = new OldSyncMessageService()
  let map = new Map()
  map.set(23, 12)
  map.set(45, 14)

  let query = service.generateQuerySyncMsg(map)
  let oldQuery = oldService.generateQuerySyncMsg(map)

  let val1 = service.handleQuerySyncMsg(query.querySync)
  let val2 = oldService.handleQuerySyncMsg(oldQuery.getQuerysync())
  t.deepEqual(val1, val2)
})

test.skip('HandleReply', async t => {
  const service = new SyncMessageService()
  const oldService = new OldSyncMessageService()

  let val1 = service.generateReplySyncMsg()
  let val2 = oldService.generateReplySyncMsg()

  t.deepEqual(val1, val2)
})
