import { Observable } from 'rxjs/Observable'
import { filter, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs/Subject'

import { Disposable } from '../Disposable'
import { BroadcastMessage, MessageEmitter, NetworkMessage, SendRandomlyMessage, SendToMessage } from '../network/'
import { collaborator } from '../proto'
import { Collaborator } from './Collaborator'

export class CollaboratorsService implements Disposable, MessageEmitter {

  static readonly DEFAULT_PSEUDO: string = 'Anonymous'
  private static ID: string = 'Collaborators'

  private pseudonym: string

  private collaboratorChangePseudoSubject: Subject<Collaborator>
  private collaboratorJoinSubject: Subject<Collaborator>
  private collaboratorLeaveSubject: Subject<number>

  private disposeSubject: Subject<void>

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>

  constructor () {
    this.collaboratorChangePseudoSubject = new Subject()
    this.collaboratorJoinSubject = new Subject()
    this.collaboratorLeaveSubject = new Subject()
    this.disposeSubject = new Subject()
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
    source.pipe(
      takeUntil(this.disposeSubject),
      filter((msg: NetworkMessage) => msg.service === CollaboratorsService.ID),
    )
      .subscribe((msg: NetworkMessage) => {
        const collabMsg = collaborator.CollaboratorMsg.decode(msg.content)
        const id: number = msg.id
        const pseudo: string = collabMsg.pseudo
        this.collaboratorChangePseudoSubject.next(new Collaborator(id, pseudo))
      })
  }

  set peerJoinSource (source: Observable<number>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((id: number) => {
        this.emitPseudo(this.pseudonym, id)
        const newCollaborator = new Collaborator(id, CollaboratorsService.DEFAULT_PSEUDO)
        this.collaboratorJoinSubject.next(newCollaborator)
      })
  }

  set peerLeaveSource (source: Observable<number>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((id: number) => {
        this.collaboratorLeaveSubject.next(id)
      })
  }

  set pseudoSource (source: Observable<string>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((pseudo: string) => {
        this.pseudonym = pseudo
        this.emitPseudo(pseudo)
      })
  }

  emitPseudo (pseudo: string, id?: number): Uint8Array {
    const collabMsg = collaborator.CollaboratorMsg.create({pseudo})

    if (id) {
      const msg: SendToMessage = new SendToMessage(
        CollaboratorsService.ID, id, collaborator.CollaboratorMsg.encode(collabMsg).finish(),
      )
      this.msgToSendToSubject.next(msg)
    } else {
      const msg: BroadcastMessage = new BroadcastMessage(
        CollaboratorsService.ID, collaborator.CollaboratorMsg.encode(collabMsg).finish(),
      )
      this.msgToBroadcastSubject.next(msg)
    }
    return collaborator.CollaboratorMsg.encode(collabMsg).finish()
  }

  dispose (): void {
    this.collaboratorChangePseudoSubject.complete()
    this.collaboratorJoinSubject.complete()
    this.collaboratorLeaveSubject.complete()
    this.disposeSubject.next()
    this.disposeSubject.complete()
    this.msgToBroadcastSubject.complete()
    this.msgToSendRandomlySubject.complete()
    this.msgToSendToSubject.complete()
  }

}
