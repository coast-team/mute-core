import test from 'ava'
import { from, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { IMessageIn, IMessageOut } from '../src/misc'
import { Streams } from '../src/Streams'
import { Interval, ReplySyncEvent, SyncMessageService } from '../src/sync'
import { generateQuerySyncMsg, generateSequentialRichLogootSOps, generateVector } from './Helpers'

function generateReplySync(): ReplySyncEvent {
  const richLogootSOps = generateSequentialRichLogootSOps()
  const intervals = [new Interval(0, 0, 5), new Interval(1, 10, 30), new Interval(42, 3, 3)]

  return new ReplySyncEvent(richLogootSOps, intervals)
}

test('richLogootSOperations-correct-send-and-delivery', (context) => {
  const msgOut1 = new Subject<IMessageOut>()
  const syncMsgIn = new SyncMessageService(new Subject<IMessageIn>(), msgOut1)
  const syncMsgOut = new SyncMessageService(
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
    syncMsgIn.localRichLogootSOperations$ = from(richLogootSOps)
    syncMsgIn.dispose()
    syncMsgOut.dispose()
  })

  let counter = 0
  context.plan(richLogootSOps.length)
  return syncMsgOut.remoteRichLogootSOperations$.pipe(
    map(
      (actual): void => {
        context.true(actual.equals(richLogootSOps[counter++]))
      }
    )
  )
})

test('querySync-correct-send-and-delivery', (context) => {
  const msgOut1 = new Subject<IMessageOut>()
  const syncMsgIn = new SyncMessageService(new Subject<IMessageIn>(), msgOut1)
  const syncMsgOut = new SyncMessageService(
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
    map((actualVector) => {
      actualVector.forEach((actual, key) => {
        context.is(actual, expectedVector.get(key as number))
      })
    })
  )
})

test('replySync-correct-recipient', (context) => {
  const msgIn = new Subject<IMessageIn>()
  const msgOut = new Subject<IMessageOut>()
  const syncMsg = new SyncMessageService(msgIn, msgOut)

  // Simulate the generation of a ReplySyncEvent
  // when delivering a remote QuerySync
  const replySyncSubject = new Subject<ReplySyncEvent>()
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
  const syncMsgIn = new SyncMessageService(msgIn, msgOut)
  const syncMsgOut = new SyncMessageService(
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
  const replySyncSubject = new Subject<ReplySyncEvent>()
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
