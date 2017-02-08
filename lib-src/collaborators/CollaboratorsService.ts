import { Observable, Observer, Subject } from 'rxjs'

import { BroadcastMessage, SendRandomlyMessage, SendToMessage, MessageEmitter, NetworkMessage } from '../network/'
import { Collaborator } from './Collaborator'
const pb = require('../../proto/collaborator_pb.js')

export class CollaboratorsService implements MessageEmitter {

  private pseudonym: string

  private collaboratorChangePseudoSubject: Subject<Collaborator>
  private collaboratorJoinObservable: Observable<Collaborator>
  private collaboratorLeaveObservable: Observable<number>

  private msgToBroadcastObservable: Observable<BroadcastMessage>
  private msgToBroadcastObservers: Observer<BroadcastMessage>[] = []

  private msgToSendRandomlyObservable: Observable<SendRandomlyMessage>
  private msgToSendRandomlyObservers: Observer<SendRandomlyMessage>[] = []

  private msgToSendToObservable: Observable<SendToMessage>
  private msgToSendToObservers: Observer<SendToMessage>[] = []

  constructor () {
    this.collaboratorChangePseudoSubject = new Subject()

    this.msgToBroadcastObservable = Observable.create((observer) => {
      this.msgToBroadcastObservers.push(observer)
    })

    this.msgToSendRandomlyObservable = Observable.create((observer) => {
      this.msgToSendRandomlyObservers.push(observer)
    })

    this.msgToSendToObservable = Observable.create((observer) => {
      this.msgToSendToObservers.push(observer)
    })
  }

  get onCollaboratorChangePseudo(): Observable<Collaborator> {
    return this.collaboratorChangePseudoSubject.asObservable()
  }

  get onCollaboratorJoin(): Observable<Collaborator> {
    return this.collaboratorJoinObservable
  }

  get onCollaboratorLeave(): Observable<number> {
    return this.collaboratorLeaveObservable
  }

  get onMsgToBroadcast(): Observable<BroadcastMessage> {
    return this.msgToBroadcastObservable
  }

  get onMsgToSendRandomly(): Observable<SendRandomlyMessage> {
    return this.msgToSendRandomlyObservable
  }

  get onMsgToSendTo(): Observable<SendToMessage> {
    return this.msgToSendToObservable
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
      this.msgToSendToObservers.forEach((observer: Observer<SendToMessage>) => {
        observer.next(msg)
      })
    } else {
      const msg: BroadcastMessage = new BroadcastMessage(this.constructor.name, collabMsg.serializeBinary())
      this.msgToBroadcastObservers.forEach((observer: Observer<BroadcastMessage>) => {
        observer.next(msg)
      })
    }
  }

}
