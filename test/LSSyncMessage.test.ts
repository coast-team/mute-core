import test from 'ava'
import { from, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { LogootSOperation } from 'mute-structs'
import { Interval, ReplySyncEvent, StateVector } from '../src/core'
import { LSSyncMessage } from '../src/crdtImpl/LogootSplit'
import { IMessageIn, IMessageOut } from '../src/misc'
import { Streams } from '../src/Streams'
import { generateQuerySyncMsg, generateSequentialRichLogootSOps, generateVector } from './LSHelpers'

function generateReplySync(): ReplySyncEvent<LogootSOperation> {
  const richLogootSOps = generateSequentialRichLogootSOps()
  const intervals = [new Interval(0, 0, 5), new Interval(1, 10, 30), new Interval(42, 3, 3)]

  return new ReplySyncEvent(richLogootSOps, intervals)
}

test('richLogootSOperations-correct-send-and-delivery', (context) => {
  const msgOut1 = new Subject<IMessageOut>()
  const syncMsgIn = new LSSyncMessage(new Subject<IMessageIn>(), msgOut1)
  const syncMsgOut = new LSSyncMessage(
    msgOut1.pipe(
      map((msg) => {
        const { recipientId, ...rest } = msg
        return { senderId: recipientId || 0, ...rest }
      })
    ),
    new Subject<IMessageOut>()
  )

  const richLogootSOps = generateSequentialRichLogootSOps()
  setTimeout(() => {
    syncMsgIn.localRichOperations$ = from(richLogootSOps)
    syncMsgIn.dispose()
    syncMsgOut.dispose()
  })
  let counter = 0
  context.plan(richLogootSOps.length)
  return syncMsgOut.remoteRichOperations$.pipe(
    map(
      (actual): void => {
        const aOther = richLogootSOps[counter++]
        context.true(actual.equals(aOther))
      }
    )
  )
})

test('querySync-correct-send-and-delivery', (context) => {
  const msgOut1 = new Subject<IMessageOut>()
  const syncMsgIn = new LSSyncMessage(new Subject<IMessageIn>(), msgOut1)
  const syncMsgOut = new LSSyncMessage(
    msgOut1.pipe(
      map((msg) => {
        const { recipientId, ...rest } = msg
        return { senderId: recipientId || 0, ...rest }
      })
    ),
    new Subject<IMessageOut>()
  )

  const expectedVector = generateVector()
  setTimeout(() => {
    syncMsgIn.querySync$ = from([expectedVector])
    syncMsgIn.dispose()
    syncMsgOut.dispose()
  })

  context.plan(expectedVector.size)
  return syncMsgOut.remoteQuerySync$.pipe(
    map((actualVector: StateVector) => {
      actualVector.forEach((actual, key) => {
        context.is(actual, expectedVector.get(key as number))
      })
    })
  )
})

test('replySync-correct-recipient', (context) => {
  const msgIn = new Subject<IMessageIn>()
  const msgOut = new Subject<IMessageOut>()
  const syncMsg = new LSSyncMessage(msgIn, msgOut)

  // Simulate the generation of a ReplySyncEvent
  // when delivering a remote QuerySync
  const replySyncSubject = new Subject<ReplySyncEvent<LogootSOperation>>()
  syncMsg.replySync$ = replySyncSubject
  syncMsg.remoteQuerySync$.subscribe(() => replySyncSubject.next(generateReplySync()))

  const expected = 42

  setTimeout(() => {
    msgIn.next({
      streamId: Streams.DOCUMENT_CONTENT,
      senderId: expected,
      content: generateQuerySyncMsg(generateVector()),
    })
    syncMsg.dispose()
    msgIn.complete()
    msgOut.complete()
  })

  context.plan(1)
  return msgOut.pipe(map(({ recipientId: id }) => context.is(id, expected)))
})

test('replySync-correct-send-and-delivery', (context) => {
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const syncMsgIn = new LSSyncMessage(msgIn, msgOut)
  const syncMsgOut = new LSSyncMessage(
    msgOut.pipe(
      map((msg) => {
        const { recipientId, ...rest } = msg
        return { senderId: recipientId || 0, ...rest }
      })
    ),
    new Subject<IMessageOut>()
  )

  // Simulate the generation of a ReplySyncEvent
  // when delivering a remote QuerySync
  const replySyncSubject = new Subject<ReplySyncEvent<LogootSOperation>>()
  syncMsgIn.replySync$ = replySyncSubject
  const expected = generateReplySync()
  syncMsgIn.remoteQuerySync$.subscribe(() => replySyncSubject.next(expected))

  setTimeout(() => {
    msgIn.next({
      streamId: Streams.DOCUMENT_CONTENT,
      senderId: 0,
      content: generateQuerySyncMsg(generateVector()),
    })
    syncMsgIn.dispose()
    syncMsgOut.dispose()
    msgIn.complete()
    msgOut.complete()
  })

  context.plan(1)
  return syncMsgOut.remoteReplySync$.pipe(
    map((actual): void => context.true(actual.equals(expected)))
  )
})
