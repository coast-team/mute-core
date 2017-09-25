import test from "ava"
import {TestContext} from "ava"
import {LogootSOperation} from "mute-structs"
import {Observable, Subject} from "rxjs"

import {ReplySyncEvent, RichLogootSOperation, SyncService} from "../src/sync"
import {disposeOf, generateRichLogootSOps} from "./Helpers"

test("deliver-buffered-operation-when-deliverable", (t: TestContext) => {
    const syncService = new SyncService(0)
    disposeOf(syncService, 200)

    const [firstRichLogootSOp, secondRichLogootSOp]: RichLogootSOperation[] =
        generateRichLogootSOps()

    const remoteRichLogootSOpSubject = new Subject<RichLogootSOperation>()
    syncService.remoteRichLogootSOperationSource = remoteRichLogootSOpSubject

    remoteRichLogootSOpSubject.next(secondRichLogootSOp)
    const expectedLogootSOp: LogootSOperation =
        secondRichLogootSOp.logootSOp

    setTimeout(() => {
        remoteRichLogootSOpSubject.next(firstRichLogootSOp)
    }, 100)

    t.plan(2)
    return syncService.onRemoteLogootSOperation
        .filter((logootSOps: LogootSOperation[]) => {
            return logootSOps[0] !== firstRichLogootSOp.logootSOp
        })
        .map((actualLogootSOps: LogootSOperation[]) => {
            t.is(actualLogootSOps.length, 1)
            t.deepEqual(actualLogootSOps, [expectedLogootSOp])
        })
})

test("deliver-buffered-operations-in-correct-order", (t: TestContext) => {
    const syncService = new SyncService(0)
    disposeOf(syncService, 200)

    const richLogootSOps: RichLogootSOperation[] = generateRichLogootSOps()
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
    return syncService.onRemoteLogootSOperation
        .map((actualLogootSOps: LogootSOperation[]) => {
            const expectedLogootSOp: LogootSOperation =
                richLogootSOps[counter].logootSOp
            t.is(actualLogootSOps.length, 1)
            t.deepEqual(actualLogootSOps, [expectedLogootSOp])
            counter++
        })
})
