import test from 'ava'
import { Identifier, IdentifierInterval, LogootSDel, LogootSAdd } from 'mute-structs'
import { SyncMessageService } from '../lib/sync/SyncMessageService'
import { Sync, QuerySync, ReplySync, LogootSAddMsg, LogootSDelMsg, RichLogootSOperationMsg, IntervalMsg, IdentifierMsg, IdentifierIntervalMsg } from '../proto/sync'

test('InitMessageService', t => {
  const service = new SyncMessageService()
  t.truthy(service)
})

test('QuerySyncMessage', t => {
  const service = new SyncMessageService()
  // let identifierIntervalMsg = service.generateIdentifierIntervalMsg(new IdentifierInterval([12], 42, 54))
  let map = new Map()
  map.set(12, 43)
  map.set(24, 47)
  const syncMsg = service.generateQuerySyncMsg(map)
  const code = QuerySync.encode(syncMsg.querySync).finish()
  t.deepEqual(syncMsg.querySync, QuerySync.decode(code))
})
