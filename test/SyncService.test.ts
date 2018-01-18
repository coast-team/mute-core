import test from 'ava'
import {TestContext} from 'ava'
import {LogootSOperation} from 'mute-structs'
import {Observable, Subject} from 'rxjs'
import { filter, map } from 'rxjs/operators'

import {ReplySyncEvent, RichLogootSOperation, SyncService} from '../src/sync'
import {disposeOf, generateCausalRichLogootSOps, generateSequentialRichLogootSOps} from './Helpers'

test('deliver-operations-in-sequential-order', (t: TestContext) => {
  const syncService = new SyncService(0)
  disposeOf(syncService, 200)

  const richLogootSOps: RichLogootSOperation[] = generateSequentialRichLogootSOps()
  const [firstRichLogootSOp, ...tailRichLogootSOps] = richLogootSOps

  const remoteRichLogootSOpSubject = new Subject<RichLogootSOperation>()
  syncService.remoteRichLogootSOperationSource = remoteRichLogootSOpSubject

  tailRichLogootSOps
        .forEach((richLogootSOp: RichLogootSOperation) => {
          remoteRichLogootSOpSubject.next(richLogootSOp)
        })
  setTimeout(() => {
    remoteRichLogootSOpSubject.next(firstRichLogootSOp)
  }, 100)

  let counter = 0
  t.plan(richLogootSOps.length * 2)
  return syncService.onRemoteLogootSOperation.pipe(
    map((actualLogootSOps: LogootSOperation[]) => {
      const expectedLogootSOp: LogootSOperation =
            richLogootSOps[counter].logootSOp
      t.is(actualLogootSOps.length, 1)
      t.deepEqual(actualLogootSOps, [expectedLogootSOp])
      counter++
    }),
  )
})

test.failing('deliver-operations-in-causal-order', (t: TestContext) => {
  const syncService = new SyncService(0)
  disposeOf(syncService, 200)

  const richLogootSOps: RichLogootSOperation[] = generateCausalRichLogootSOps()
  const [firstRichLogootSOp, secondRichLogootSOp]: RichLogootSOperation[] = richLogootSOps

  const remoteRichLogootSOpSubject = new Subject<RichLogootSOperation>()
  syncService.remoteRichLogootSOperationSource = remoteRichLogootSOpSubject

  remoteRichLogootSOpSubject.next(secondRichLogootSOp)
  const expectedLogootSOp: LogootSOperation =
        secondRichLogootSOp.logootSOp

  setTimeout(() => {
    remoteRichLogootSOpSubject.next(firstRichLogootSOp)
  }, 100)

  let counter = 0
  t.plan(richLogootSOps.length * 2)
  return syncService.onRemoteLogootSOperation.pipe(
    map((actualLogootSOps: LogootSOperation[]) => {
      const expectedLogootSOp: LogootSOperation =
            richLogootSOps[counter].logootSOp
      t.is(actualLogootSOps.length, 1)
      t.deepEqual(actualLogootSOps, [expectedLogootSOp])
      counter++
    }),
  )
})
