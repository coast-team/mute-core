import { Observable } from 'rxjs/Observable'
import { filter, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs/Subject'

import { Disposable } from '../Disposable'
import { BroadcastMessage, MessageEmitter, NetworkMessage, SendRandomlyMessage, SendToMessage } from '../network/'
import { collaborator as proto } from '../proto'
import { ICollaborator } from './ICollaborator'

export class CollaboratorsService implements Disposable, MessageEmitter {

  static readonly DEFAULT_PSEUDO: string = 'Anonymous'
  private static ID: string = 'Collaborators'

  private me: proto.ICollaborator

  private updateSubject: Subject<ICollaborator>
  private joinSubject: Subject<number>
  private leaveSubject: Subject<number>

  private disposeSubject: Subject<void>

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>

  constructor (me: proto.ICollaborator) {
    this.me = me
    this.updateSubject = new Subject()
    this.joinSubject = new Subject()
    this.leaveSubject = new Subject()
    this.disposeSubject = new Subject()
    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
  }

  get onUpdate (): Observable<ICollaborator> {
    return this.updateSubject.asObservable()
  }

  get onJoin (): Observable<number> {
    return this.joinSubject.asObservable()
  }

  get onLeave (): Observable<number> {
    return this.leaveSubject.asObservable()
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

  set messageSource (source: Observable<NetworkMessage>) {
    source.pipe(
      takeUntil(this.disposeSubject),
      filter((msg: NetworkMessage) => msg.service === CollaboratorsService.ID),
    )
      .subscribe((msg: NetworkMessage) => {
        this.updateSubject.next(Object.assign({id: msg.id}, proto.Collaborator.decode(msg.content)))
      })
  }

  set joinSource (source: Observable<number>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((id: number) => {
        this.emitUpdate(this.me, id)
        this.joinSubject.next(id)
      })
  }

  set leaveSource (source: Observable<number>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((id: number) => this.leaveSubject.next(id))
  }

  set updateSource (source: Observable<ICollaborator>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((data: ICollaborator) => {
        this.update(data)
        this.emitUpdate(this.me)
      })
  }

  dispose (): void {
    this.updateSubject.complete()
    this.joinSubject.complete()
    this.leaveSubject.complete()
    this.disposeSubject.next()
    this.disposeSubject.complete()
    this.msgToBroadcastSubject.complete()
    this.msgToSendRandomlySubject.complete()
    this.msgToSendToSubject.complete()
  }

  private emitUpdate (collab: proto.ICollaborator, id?: number): Uint8Array {
    const collabMsg = proto.Collaborator.create(collab)

    if (id) {
      const msg: SendToMessage = new SendToMessage(
        CollaboratorsService.ID, id, proto.Collaborator.encode(collabMsg).finish(),
      )
      this.msgToSendToSubject.next(msg)
    } else {
      const msg: BroadcastMessage = new BroadcastMessage(
        CollaboratorsService.ID, proto.Collaborator.encode(collabMsg).finish(),
      )
      this.msgToBroadcastSubject.next(msg)
    }
    return proto.Collaborator.encode(collabMsg).finish()
  }

  private update (collab: proto.ICollaborator) {
    this.me.displayName = collab.displayName || this.me.displayName
    this.me.login = collab.login || this.me.login
    this.me.email = collab.email || this.me.email
    this.me.avatar = collab.avatar || this.me.avatar
  }

}
