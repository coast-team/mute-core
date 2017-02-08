import { Observable, Subject } from 'rxjs'

import { BroadcastMessage, SendRandomlyMessage, SendToMessage, MessageEmitter, NetworkMessage } from '../network/'
import { Collaborator } from './Collaborator'
const pb = require('../../proto/collaborator_pb.js')

export class CollaboratorsService implements MessageEmitter {

  private pseudonym: string

  private collaboratorChangePseudoSubject: Subject<Collaborator>
  private collaboratorJoinObservable: Observable<Collaborator>
  private collaboratorLeaveObservable: Observable<number>

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>

  constructor () {
    this.collaboratorChangePseudoSubject = new Subject()
    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
  }

  get onCollaboratorChangePseudo (): Observable<Collaborator> {
    return this.collaboratorChangePseudoSubject.asObservable()
  }

  get onCollaboratorJoin (): Observable<Collaborator> {
    return this.collaboratorJoinObservable
  }

  get onCollaboratorLeave (): Observable<number> {
    return this.collaboratorLeaveObservable
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
    .filter((msg: NetworkMessage) => msg.service === this.constructor.name)
    .subscribe((msg: NetworkMessage) => {
      const pbCollaborator = new pb.Collaborator.deserializeBinary(msg.content)
      const id: number = msg.id
      const pseudo: string = pbCollaborator.getPseudo()
      this.collaboratorChangePseudoSubject.next(new Collaborator(id, pseudo))
    })
  }

  set peerJoinSource (source: Observable<number>) {
    this.collaboratorJoinObservable = source.map((id: number) => {
      this.emitPseudo(this.pseudonym, id)
      return new Collaborator(id, 'Anonymous')
    })
  }

  set peerLeaveSource (source: Observable<number>) {
    this.collaboratorLeaveObservable = source
  }

  set pseudoSource (source: Observable<String>) {
    source.subscribe((pseudo: string) => {
      this.pseudonym = pseudo
      this.emitPseudo(pseudo)
    })
  }

  emitPseudo (pseudo: string, id?: number): void {
    const collabMsg = new pb.Collaborator()
    collabMsg.setPseudo(pseudo)

    if (id) {
      const msg: SendToMessage = new SendToMessage(this.constructor.name, id, collabMsg.serializeBinary())
      this.msgToSendToSubject.next(msg)
    } else {
      const msg: BroadcastMessage = new BroadcastMessage(this.constructor.name, collabMsg.serializeBinary())
      this.msgToBroadcastSubject.next(msg)
    }
  }

}
