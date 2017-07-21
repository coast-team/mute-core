import { Observable, Subject, Subscription } from 'rxjs'

import { BroadcastMessage, SendRandomlyMessage, SendToMessage, MessageEmitter, NetworkMessage } from '../network/'
import { Collaborator } from './Collaborator'
const pb = require('../../proto/collaborator_pb.js')


export class OldCollaboratorsService implements MessageEmitter {

  private static ID: string = 'Collaborators'

  private pseudonym: string

  private collaboratorChangePseudoSubject: Subject<Collaborator>
  private collaboratorJoinSubject: Subject<Collaborator>
  private collaboratorLeaveSubject: Subject<number>

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>

  private peerJoinSubscription: Subscription
  private peerLeaveSubscription: Subscription
  private pseudoSubscription: Subscription

  constructor () {
    this.collaboratorChangePseudoSubject = new Subject()
    this.collaboratorJoinSubject = new Subject()
    this.collaboratorLeaveSubject = new Subject()
    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
  }

  get onCollaboratorChangePseudo (): Observable<Collaborator> {
    return this.collaboratorChangePseudoSubject.asObservable()
  }

  get onCollaboratorJoin (): Observable<Collaborator> {
    return this.collaboratorJoinSubject.asObservable()
  }

  get onCollaboratorLeave (): Observable<number> {
    return this.collaboratorLeaveSubject.asObservable()
  }

  get onMsgToBroadcast (): Observable<BroadcastMessage> {
    return this.msgToBroadcastSubject.asObservable()
  }

  get onMsgToSendRandomly (): Observable<SendRandomlyMessage> {
    return this.msgToSendRandomlySubject.asObservable()
  }

  get onMsgToSendTo (): Observable<SendToMessage> {
    return this.msgToSendToSubject.asObservable()
  }

  set leaveSource (source: Observable<void>) {}

  set messageSource (source: Observable<NetworkMessage>) {
    source
    .filter((msg: NetworkMessage) => msg.service === OldCollaboratorsService.ID)
    .subscribe((msg: NetworkMessage) => {
      const pbCollaborator = new pb.Collaborator.deserializeBinary(msg.content)
      const id: number = msg.id
      const pseudo: string = pbCollaborator.getPseudo()
      this.collaboratorChangePseudoSubject.next(new Collaborator(id, pseudo))
    })
  }

  set peerJoinSource (source: Observable<number>) {
    this.peerJoinSubscription = source.subscribe((id: number) => {
      this.emitPseudo(this.pseudonym, id)
      this.collaboratorJoinSubject.next(new Collaborator(id, 'Anonymous'))
    })
  }

  set peerLeaveSource (source: Observable<number>) {
    this.peerLeaveSubscription = source.subscribe((id: number) => {
      this.collaboratorLeaveSubject.next(id)
    })
  }

  set pseudoSource (source: Observable<String>) {
    this.pseudoSubscription = source.subscribe((pseudo: string) => {
      this.pseudonym = pseudo
      this.emitPseudo(pseudo)
    })
  }

  emitPseudo (pseudo: string, id?: number): ArrayBuffer {
    const collabMsg = new pb.Collaborator()
    collabMsg.setPseudo(pseudo)

    if (id) {
      const msg: SendToMessage = new SendToMessage(OldCollaboratorsService.ID, id, collabMsg.serializeBinary())
      this.msgToSendToSubject.next(msg)
    } else {
      const msg: BroadcastMessage = new BroadcastMessage(OldCollaboratorsService.ID, collabMsg.serializeBinary())
      this.msgToBroadcastSubject.next(msg)
    }
    return collabMsg.serializeBinary()
  }

  clean (): void {
    this.collaboratorChangePseudoSubject.complete()
    this.collaboratorJoinSubject.complete()
    this.collaboratorLeaveSubject.complete()
    this.msgToBroadcastSubject.complete()
    this.msgToSendRandomlySubject.complete()
    this.msgToSendToSubject.complete()

    this.peerJoinSubscription.unsubscribe()
    this.peerLeaveSubscription.unsubscribe()
    this.pseudoSubscription.unsubscribe()
  }

}
