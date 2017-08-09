import test from "ava"
import { AssertContext } from "ava"
import {
    Identifier,
    IdentifierInterval,
    LogootSAdd,
    LogootSDel
} from "mute-structs"
import { Observable } from "rxjs"

import { BroadcastMessage, NetworkMessage, SendRandomlyMessage } from "../src/network"
import { RichLogootSOperation } from "../src/sync/RichLogootSOperation"
import { SyncMessageService } from "../src/sync/SyncMessageService"

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

test("in-out-richLogootSOperations", (t: AssertContext) => {
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

    syncMsgServiceOut.onRemoteRichLogootSOperation
        .subscribe((actual: RichLogootSOperation) => {
            const expected: RichLogootSOperation = richLogootSOps[counter]
            t.true(actual.equals(expected))

            counter++
        })

    syncMsgServiceIn.localRichLogootSOperationSource =
        Observable.from(richLogootSOps)
})

test("in-out-querySync", (t: AssertContext) => {
    const syncMsgServiceIn = new SyncMessageService()
    const syncMsgServiceOut = new SyncMessageService()

    const expected: Map<number, number> = new Map()
    expected.set(0, 42)
    expected.set(1, 10)
    expected.set(53, 1)

    syncMsgServiceOut.messageSource =
        syncMsgServiceIn.onMsgToSendRandomly
            .map((msg: SendRandomlyMessage): NetworkMessage => {
                return new NetworkMessage(msg.service, 0, true, msg.content)
            })

    syncMsgServiceOut.onRemoteQuerySync
        .subscribe((actualVector: Map<number, number>) => {
            actualVector.forEach((actual: number, key: number) => {
                t.is(actual, expected.get(key))
            })
        })

    syncMsgServiceIn.querySyncSource = Observable.from([expected])
})
