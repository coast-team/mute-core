import { Observable, Subject } from 'rxjs'
import { filter, map, takeUntil } from 'rxjs/operators'

import { Disposable } from '../Disposable'
import {
  BroadcastMessage,
  MessageEmitter,
  NetworkMessage,
  SendRandomlyMessage,
  SendToMessage,
} from '../network/'
import { collaborator as proto } from '../proto'
import { ICollaborator } from './ICollaborator'

export class CollaboratorsService implements Disposable, MessageEmitter {
  private static ID: number = 421

  private me: ICollaborator
  private collaborators: Map<number, ICollaborator>

  private updateSubject: Subject<ICollaborator>
  private joinSubject: Subject<ICollaborator>
  private leaveSubject: Subject<number>

  private disposeSubject: Subject<void>

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>

  constructor(me: ICollaborator) {
    this.me = me
    this.updateSubject = new Subject()
    this.joinSubject = new Subject()
    this.leaveSubject = new Subject()
    this.disposeSubject = new Subject()
    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
    this.collaborators = new Map()
    // this.collaborators.set(this.me.id, this.me)
  }

  get onUpdate(): Observable<ICollaborator> {
    return this.updateSubject.asObservable()
  }

  get onJoin(): Observable<ICollaborator> {
    return this.joinSubject.asObservable()
  }

  get onLeave(): Observable<number> {
    return this.leaveSubject.asObservable()
  }

  get onMsgToBroadcast(): Observable<BroadcastMessage> {
    return this.msgToBroadcastSubject.asObservable()
  }

  get onMsgToSendRandomly(): Observable<SendRandomlyMessage> {
    return this.msgToSendRandomlySubject.asObservable()
  }

  get onMsgToSendTo(): Observable<SendToMessage> {
    return this.msgToSendToSubject.asObservable()
  }

  set messageSource(source: Observable<NetworkMessage>) {
    source
      .pipe(
        takeUntil(this.disposeSubject),
        filter((msg: NetworkMessage) => msg.service === CollaboratorsService.ID)
      )
      .subscribe((msg: NetworkMessage) => {
        const collab = Object.assign({ id: msg.id }, proto.Collaborator.decode(msg.content))
        if (!this.collaborators.has(collab.id)) {
          this.collaborators.set(collab.id, collab)
          this.joinSubject.next(collab)
        } else {
          this.collaborators.set(collab.id, collab)
          this.updateSubject.next(collab)
        }
      })
  }

  set joinSource(source: Observable<number>) {
    source
      .pipe(takeUntil(this.disposeSubject))
      .subscribe((id: number) => this.emitUpdate(this.me, id))
  }

  set leaveSource(source: Observable<number>) {
    source.pipe(takeUntil(this.disposeSubject)).subscribe((id: number) => {
      this.collaborators.delete(id)
      this.leaveSubject.next(id)
    })
  }

  set updateSource(source: Observable<ICollaborator>) {
    source.pipe(takeUntil(this.disposeSubject)).subscribe((data: ICollaborator) => {
      this.me.displayName = data.displayName || this.me.displayName
      this.me.login = data.login || this.me.login
      this.me.email = data.email || this.me.email
      this.me.avatar = data.avatar || this.me.avatar
      this.emitUpdate(this.me)
    })
  }

  dispose(): void {
    this.updateSubject.complete()
    this.joinSubject.complete()
    this.leaveSubject.complete()
    this.disposeSubject.next()
    this.disposeSubject.complete()
    this.msgToBroadcastSubject.complete()
    this.msgToSendRandomlySubject.complete()
    this.msgToSendToSubject.complete()
  }

  private emitUpdate(collab: ICollaborator, id?: number) {
    const collabMsg = proto.Collaborator.create(collab)

    if (id) {
      const msg: SendToMessage = new SendToMessage(
        CollaboratorsService.ID,
        id,
        proto.Collaborator.encode(collabMsg).finish()
      )
      this.msgToSendToSubject.next(msg)
    } else {
      const msg: BroadcastMessage = new BroadcastMessage(
        CollaboratorsService.ID,
        proto.Collaborator.encode(collabMsg).finish()
      )
      this.msgToBroadcastSubject.next(msg)
    }
  }
}
