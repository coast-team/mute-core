import test from "ava"
import { TestContext } from "ava"
import {
    Identifier,
    IdentifierInterval,
    LogootSAdd,
    LogootSDel
} from "mute-structs"
import { Observable, Subject } from "rxjs"

import {
    BroadcastMessage,
    NetworkMessage,
    SendRandomlyMessage,
    SendToMessage
} from "../src/network"
import {
    ReplySyncEvent,
    RichLogootSOperation,
    SyncMessageService
} from "../src/sync"

function disposeOf (syncMsgService: SyncMessageService, time: number): void {
    setTimeout(() => {
        syncMsgService.clean()
    }, time)
}

function generateRichLogootSOps (): RichLogootSOperation[] {
    const replicaNumber = 0
    const clock = 0
    const base = [0, 0, replicaNumber]

    const id1 = new Identifier(base, 0)
    const insertOp1: LogootSAdd = new LogootSAdd(id1, "hello")
    const richLogootSOp1 =
        new RichLogootSOperation(replicaNumber, clock, insertOp1)

    const id2 = new Identifier(base, 5)
    const insertOp2: LogootSAdd = new LogootSAdd(id2, " world")
    const richLogootSOp2 =
        new RichLogootSOperation(replicaNumber, clock + 1, insertOp2)

    const idInterval1 = new IdentifierInterval(base, 3, 7)
    const deleteOp1: LogootSDel = new LogootSDel([idInterval1])
    const richLogootSOp3 =
        new RichLogootSOperation(replicaNumber, clock + 2, deleteOp1)

    return [richLogootSOp1, richLogootSOp2, richLogootSOp3]
}

function generateVector (): Map<number, number> {
    const vector: Map<number, number> = new Map()
    vector.set(0, 42)
    vector.set(1, 10)
    vector.set(53, 1)

    return vector
}

test("richLogootSOperations-correct-send-and-delivery", (t: TestContext) => {
    const syncMsgServiceIn = new SyncMessageService()
    disposeOf(syncMsgServiceIn, 1000)
    const syncMsgServiceOut = new SyncMessageService()
    disposeOf(syncMsgServiceOut, 1000)

    // Simulate the network between the two instances of the service
    syncMsgServiceOut.messageSource =
        syncMsgServiceIn.onMsgToBroadcast
            .map((msg: BroadcastMessage): NetworkMessage => {
                return new NetworkMessage(msg.service, 0, true, msg.content)
            })

    const richLogootSOps: RichLogootSOperation[] = generateRichLogootSOps()
    setTimeout(() => {
        syncMsgServiceIn.localRichLogootSOperationSource =
            Observable.from(richLogootSOps)
    }, 0)

    let counter = 0
    t.plan(richLogootSOps.length)
    return syncMsgServiceOut.onRemoteRichLogootSOperation
        .map((actual: RichLogootSOperation): void => {
            const expected: RichLogootSOperation = richLogootSOps[counter]
            t.true(actual.equals(expected))

            counter++
        })
})

test("querySync-correct-send-and-delivery", (t: TestContext) => {
    const syncMsgServiceIn = new SyncMessageService()
    disposeOf(syncMsgServiceIn, 1000)
    const syncMsgServiceOut = new SyncMessageService()
    disposeOf(syncMsgServiceOut, 1000)


    syncMsgServiceOut.messageSource =
        syncMsgServiceIn.onMsgToSendRandomly
            .map((msg: SendRandomlyMessage): NetworkMessage => {
                return new NetworkMessage(msg.service, 0, true, msg.content)
            })

    const expectedVector: Map<number, number> = generateVector()
    setTimeout(() => {
        syncMsgServiceIn.querySyncSource = Observable.from([expectedVector])
    }, 0)

    t.plan(expectedVector.size)
    return syncMsgServiceOut.onRemoteQuerySync
        .map((actualVector: Map<number, number>): void => {
            actualVector.forEach((actual: number, key: number): void => {
                t.is(actual, expectedVector.get(key))
            })
        })
})

test("replySync-correct-recipient", (t: TestContext) => {
    const syncMsgService = new SyncMessageService()
    disposeOf(syncMsgService, 1000)

    // Simulate the generation of a ReplySyncEvent
    // when delivering a remote QuerySync
    const replySyncSubject: Subject<ReplySyncEvent> = new Subject<ReplySyncEvent>()
    syncMsgService.replySyncSource = replySyncSubject.asObservable()
    syncMsgService.onRemoteQuerySync
        .subscribe((vector: Map<number, number>): void => {
            const replySyncEvent: ReplySyncEvent = new ReplySyncEvent([], [])
            replySyncSubject.next(replySyncEvent)
        })

    const expected = 42
    const vector: Map<number, number> = generateVector()
    const querySyncMsg = syncMsgService.generateQuerySyncMsg(vector)
    const msgSubject: Subject<NetworkMessage> = new Subject<NetworkMessage>()
    syncMsgService.messageSource = msgSubject.asObservable()
    setTimeout(() => {
        msgSubject.next(new NetworkMessage("SyncMessage", expected, false, querySyncMsg))
    }, 0)

    t.plan(1)
    return syncMsgService.onMsgToSendTo
        .map((msg: SendToMessage): void => {
            t.is(msg.id, expected)
        })
})
