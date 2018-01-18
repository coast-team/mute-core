import test from 'ava'
import { TestContext } from 'ava'
import {
    Identifier,
    IdentifierInterval,
    LogootSAdd,
    LogootSDel,
} from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { from } from 'rxjs/observable/from'
import { map } from 'rxjs/operators'
import {
    BroadcastMessage,
    NetworkMessage,
    SendRandomlyMessage,
    SendToMessage,
} from '../src/network'
import {
    Interval,
    ReplySyncEvent,
    RichLogootSOperation,
    StateVector,
    SyncMessageService,
} from '../src/sync'

import {disposeOf, generateSequentialRichLogootSOps, generateVector} from './Helpers'

function generateIntervals (): Interval[] {
  const intervals: Interval[] = []
  intervals.push(new Interval(0, 0, 5))
  intervals.push(new Interval(1, 10, 30))
  intervals.push(new Interval(42, 3, 3))

  return intervals
}

function generateReplySync (): ReplySyncEvent {
  const richLogootSOps: RichLogootSOperation[] = generateSequentialRichLogootSOps()
  const intervals: Interval[] = generateIntervals()

  return new ReplySyncEvent(richLogootSOps, intervals)
}

test('richLogootSOperations-correct-send-and-delivery', (t: TestContext) => {
  const syncMsgServiceIn = new SyncMessageService()
  disposeOf(syncMsgServiceIn, 200)
  const syncMsgServiceOut = new SyncMessageService()
  disposeOf(syncMsgServiceOut, 200)

    // Simulate the network between the two instances of the service
  syncMsgServiceOut.messageSource =
        syncMsgServiceIn.onMsgToBroadcast.pipe(
          map((msg: BroadcastMessage): NetworkMessage => {
            return new NetworkMessage(msg.service, 0, true, msg.content)
          }),
        )

  const richLogootSOps: RichLogootSOperation[] = generateSequentialRichLogootSOps()
  setTimeout(() => {
    syncMsgServiceIn.localRichLogootSOperationSource = from(richLogootSOps)
  }, 0)

  let counter = 0
  t.plan(richLogootSOps.length)
  return syncMsgServiceOut.onRemoteRichLogootSOperation.pipe(
    map((actual: RichLogootSOperation): void => {
      const expected: RichLogootSOperation = richLogootSOps[counter]
      t.true(actual.equals(expected))

      counter++
    }),
  )
})

test('querySync-correct-send-and-delivery', (t: TestContext) => {
  const syncMsgServiceIn = new SyncMessageService()
  disposeOf(syncMsgServiceIn, 200)
  const syncMsgServiceOut = new SyncMessageService()
  disposeOf(syncMsgServiceOut, 200)

  syncMsgServiceOut.messageSource =
        syncMsgServiceIn.onMsgToSendRandomly.pipe(
          map((msg: SendRandomlyMessage): NetworkMessage => {
            return new NetworkMessage(msg.service, 0, true, msg.content)
          }),
        )

  const expectedVector: StateVector = generateVector()
  setTimeout(() => {
    syncMsgServiceIn.querySyncSource = from([expectedVector])
  }, 0)

  t.plan(expectedVector.size)
  return syncMsgServiceOut.onRemoteQuerySync.pipe(
    map((actualVector: StateVector): void => {
      actualVector.forEach((actual: number, key: number): void => {
        t.is(actual, expectedVector.get(key))
      })
    }),
  )
})

test('replySync-correct-recipient', (t: TestContext) => {
  const syncMsgService = new SyncMessageService()
  disposeOf(syncMsgService, 200)

    // Simulate the generation of a ReplySyncEvent
    // when delivering a remote QuerySync
  const replySyncSubject: Subject<ReplySyncEvent> = new Subject<ReplySyncEvent>()
  syncMsgService.replySyncSource = replySyncSubject.asObservable()
  syncMsgService.onRemoteQuerySync
        .subscribe((vector: StateVector): void => {
          const replySyncEvent: ReplySyncEvent = generateReplySync()
          replySyncSubject.next(replySyncEvent)
        })

  const expected = 42
  const vector: StateVector = generateVector()
  const querySyncMsg = syncMsgService.generateQuerySyncMsg(vector)
  const msgSubject: Subject<NetworkMessage> = new Subject<NetworkMessage>()
  syncMsgService.messageSource = msgSubject.asObservable()
  setTimeout(() => {
    msgSubject.next(new NetworkMessage('SyncMessage', expected, false, querySyncMsg))
  }, 0)

  t.plan(1)
  return syncMsgService.onMsgToSendTo.pipe(
    map((msg: SendToMessage): void => {
      t.is(msg.id, expected)
    }),
  )
})

test('replySync-correct-send-and-delivery', (t: TestContext) => {
  const syncMsgServiceIn = new SyncMessageService()
  disposeOf(syncMsgServiceIn, 200)
  const syncMsgServiceOut = new SyncMessageService()
  disposeOf(syncMsgServiceOut, 200)

    // Simulate the generation of a ReplySyncEvent
    // when delivering a remote QuerySync
  const replySyncSubject: Subject<ReplySyncEvent> = new Subject<ReplySyncEvent>()
  syncMsgServiceIn.replySyncSource = replySyncSubject.asObservable()
  const expected: ReplySyncEvent = generateReplySync()
  syncMsgServiceIn.onRemoteQuerySync
        .subscribe((vector: StateVector): void => {
          replySyncSubject.next(expected)
        })

  syncMsgServiceOut.messageSource =
        syncMsgServiceIn.onMsgToSendTo.pipe(
          map((msg: SendToMessage): NetworkMessage => {
            return new NetworkMessage(msg.service, 0, true, msg.content)
          }),
        )

  const vector: StateVector = generateVector()
  const querySyncMsg = syncMsgServiceIn.generateQuerySyncMsg(vector)
  const msgSubject: Subject<NetworkMessage> = new Subject<NetworkMessage>()
  syncMsgServiceIn.messageSource = msgSubject.asObservable()
  setTimeout(() => {
    msgSubject.next(new NetworkMessage('SyncMessage', 0, false, querySyncMsg))
  }, 0)

  t.plan(1)
  return syncMsgServiceOut.onRemoteReplySync.pipe(
    map((actual: ReplySyncEvent): void => {
      t.true(actual.equals(expected))
    }),
  )
})
