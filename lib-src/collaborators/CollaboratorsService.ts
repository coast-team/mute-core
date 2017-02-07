import { BehaviorSubject, Observable, Observer } from 'rxjs'

import { BroadcastMessage, SendRandomlyMessage, SendToMessage, MessageEmitter, NetworkMessage } from '../network/'
import { Collaborator } from './Collaborator'
const pb = require('../../proto/collaborator_pb.js')

export class CollaboratorsService implements MessageEmitter {

  private pseudonym: string

  private collaboratorsSubject: BehaviorSubject<Collaborator[]>

  private msgToBroadcastObservable: Observable<BroadcastMessage>
  private msgToBroadcastObservers: Observer<BroadcastMessage>[] = []

  private msgToSendRandomlyObservable: Observable<SendRandomlyMessage>
  private msgToSendRandomlyObservers: Observer<SendRandomlyMessage>[] = []

  private msgToSendToObservable: Observable<SendToMessage>
  private msgToSendToObservers: Observer<SendToMessage>[] = []

  private mapCollaborators: Map<number, Collaborator>

  constructor () {
    this.mapCollaborators = new Map<number, Collaborator>()
    this.collaboratorsSubject = new BehaviorSubject(this.mapCollaboratorsToArray)

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

  get mapCollaboratorsToArray(): Collaborator[] {
    const collaborators: Collaborator[] = []
    this.mapCollaborators.forEach((collaborator: Collaborator) => {
      collaborators.push(collaborator)
    })
    return collaborators
  }

  get collaborators(): Observable<Collaborator[]> {
    return this.collaboratorsSubject.asObservable()
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

  set leaveSource (source: Observable<void>) {
    source.subscribe(() => {
      this.mapCollaborators.clear()
    })
  }

  set messageSource (source: Observable<NetworkMessage>) {
    source
    .filter((msg: NetworkMessage) => msg.service === this.constructor.name)
    .subscribe((msg: NetworkMessage) => {
      const pbCollaborator = new pb.Collaborator.deserializeBinary(msg.content)
      const id: number = msg.id
      const pseudo: string = pbCollaborator.getPseudo()
      if (this.mapCollaborators.has(id)) {
        this.mapCollaborators.set(id, new Collaborator(id, pseudo))
        this.collaboratorsSubject.next(this.mapCollaboratorsToArray)
      }
    })
  }

  set peerJoinSource (source: Observable<number>) {
    source.subscribe((id: number) => {
      this.emitPseudo(this.pseudonym, id)
      const collab = new Collaborator(id, 'Anonymous')
      this.mapCollaborators.set(id, collab)
      this.collaboratorsSubject.next(this.mapCollaboratorsToArray)
    })
  }

  set peerLeaveSource (source: Observable<number>) {
    source.subscribe((id: number) => {
      if (this.mapCollaborators.has(id)) {
        this.mapCollaborators.delete(id)
        this.collaboratorsSubject.next(this.mapCollaboratorsToArray)
      }
    })
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
