import test from "ava"
import { TestContext } from "ava"
import {
    Identifier,
    IdentifierInterval,
    LogootSAdd,
    LogootSDel
} from "mute-structs"
import { Observable } from "rxjs"

import {
    BroadcastMessage,
    NetworkMessage,
    SendRandomlyMessage
} from "../src/network"
import {
    RichLogootSOperation,
    SyncMessageService
} from "../src/sync"

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

test("richLogootSOperations-correct-send-and-delivery", (t: TestContext) => {
    const syncMsgServiceIn = new SyncMessageService()
    const syncMsgServiceOut = new SyncMessageService()

    const richLogootSOps: RichLogootSOperation[] = generateRichLogootSOps()
    let counter = 0

    // Simulate the network between the two instances of the service
    syncMsgServiceOut.messageSource =
        syncMsgServiceIn.onMsgToBroadcast
            .map((msg: BroadcastMessage): NetworkMessage => {
                return new NetworkMessage(msg.service, 0, true, msg.content)
            })

    setTimeout(() => {
        syncMsgServiceIn.localRichLogootSOperationSource =
            Observable.from(richLogootSOps)
    }, 0)

    t.plan(richLogootSOps.length)
    return syncMsgServiceOut.onRemoteRichLogootSOperation
        .take(richLogootSOps.length)
        .map((actual: RichLogootSOperation): void => {
            const expected: RichLogootSOperation = richLogootSOps[counter]
            t.true(actual.equals(expected))

            counter++
        })
})

test("querySync-correct-send-and-delivery", (t: TestContext) => {
    const syncMsgServiceIn = new SyncMessageService()
    const syncMsgServiceOut = new SyncMessageService()

    const expectedVector: Map<number, number> = new Map()
    expectedVector.set(0, 42)
    expectedVector.set(1, 10)
    expectedVector.set(53, 1)

    syncMsgServiceOut.messageSource =
        syncMsgServiceIn.onMsgToSendRandomly
            .map((msg: SendRandomlyMessage): NetworkMessage => {
                return new NetworkMessage(msg.service, 0, true, msg.content)
            })

    setTimeout(() => {
        syncMsgServiceIn.querySyncSource = Observable.from([expectedVector])
    }, 0)

    t.plan(expectedVector.size)
    return syncMsgServiceOut.onRemoteQuerySync
        .first()
        .map((actualVector: Map<number, number>): void => {
            actualVector.forEach((actual: number, key: number): void => {
                t.is(actual, expectedVector.get(key))
            })
        })
})
