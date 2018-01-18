import test from 'ava'
import {TestContext} from 'ava'
import {LogootSOperation} from 'mute-structs'
import {Observable, Subject} from 'rxjs'
import { filter, map } from 'rxjs/operators'

import {ReplySyncEvent, RichLogootSOperation, SyncService} from '../src/sync'
import {disposeOf, generateSequentialRichLogootSOps} from './Helpers'

test('deliver-buffered-operation-when-deliverable', (t: TestContext) => {
  const syncService = new SyncService(0)
  disposeOf(syncService, 200)

  const [firstRichLogootSOp, secondRichLogootSOp]: RichLogootSOperation[] =
        generateSequentialRichLogootSOps()

  const remoteRichLogootSOpSubject = new Subject<RichLogootSOperation>()
  syncService.remoteRichLogootSOperationSource = remoteRichLogootSOpSubject

  remoteRichLogootSOpSubject.next(secondRichLogootSOp)
  const expectedLogootSOp: LogootSOperation =
        secondRichLogootSOp.logootSOp

  setTimeout(() => {
    remoteRichLogootSOpSubject.next(firstRichLogootSOp)
  }, 100)

  t.plan(2)
  return syncService.onRemoteLogootSOperation.pipe(
    filter((logootSOps: LogootSOperation[]) => {
      return logootSOps[0] !== firstRichLogootSOp.logootSOp
    }),
    map((actualLogootSOps: LogootSOperation[]) => {
      t.is(actualLogootSOps.length, 1)
      t.deepEqual(actualLogootSOps, [expectedLogootSOp])
    }),
  )
})

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
