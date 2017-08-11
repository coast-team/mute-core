import test from "ava"
import { TestContext } from "ava"
import { Observable } from "rxjs"

import { Collaborator, CollaboratorsService } from "../src/collaborators"
import {
    BroadcastMessage,
    NetworkMessage
} from "../src/network"

function disposeOf (collaboratorsService: CollaboratorsService, time: number): void {
    setTimeout(() => {
        collaboratorsService.clean()
    }, time)
}

test("pseudos-correct-send-and-delivery", (t: TestContext) => {
    const collaboratorsServiceIn = new CollaboratorsService()
    disposeOf(collaboratorsServiceIn, 200)
    const collaboratorsServiceOut = new CollaboratorsService()
    disposeOf(collaboratorsServiceOut, 200)

    const expectedId = 42
    collaboratorsServiceOut.messageSource =
        collaboratorsServiceIn.onMsgToBroadcast
            .map((msg: BroadcastMessage): NetworkMessage => {
                return new NetworkMessage(msg.service, expectedId, true, msg.content)
            })

    const pseudos = ["Hello", "There,", "How", "Are", "You?"]
    setTimeout(() => {
        collaboratorsServiceIn.pseudoSource = Observable.from(pseudos)
    }, 0)

    t.plan(pseudos.length * 2)
    let counter = 0
    return collaboratorsServiceOut.onCollaboratorChangePseudo
        .map((collaborator: Collaborator): void => {
            const expectedPseudo = pseudos[counter]
            t.is(collaborator.id, expectedId)
            t.is(collaborator.pseudo, expectedPseudo)

            counter++
        })
})
