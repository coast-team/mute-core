import { Observable, Subject } from 'rxjs'

import { filter } from 'rxjs/operators'
import { IMessageIn, IMessageOut, Service } from '../misc'
import { collaborator as proto } from '../proto/index'
import { Streams } from '../Streams'
import { ICollaborator } from './ICollaborator'

export class CollaboratorsService extends Service {
  public me: ICollaborator
  public collaborators: Map<number, ICollaborator>

  private updateSubject: Subject<ICollaborator>
  private joinSubject: Subject<ICollaborator>
  private leaveSubject: Subject<number>

  constructor(
    messageIn: Observable<IMessageIn>,
    messageOut: Subject<IMessageOut>,
    me: ICollaborator
  ) {
    super(messageIn, messageOut, Streams.COLLABORATORS)
    this.me = me
    this.collaborators = new Map()
    this.updateSubject = new Subject()
    this.joinSubject = new Subject()
    this.leaveSubject = new Subject()
    // this.collaborators.set(this.me.id, this.me)

    this.newSub = messageIn
      .pipe(filter(({ streamId }) => streamId === Streams.COLLABORATORS))
      .subscribe(({ senderId, content }) => {
        const collabUpdate = Object.assign({ id: senderId }, proto.Collaborator.decode(content))
        const collab = this.collaborators.get(collabUpdate.id)
        if (collab) {
          collab.muteCoreId = collabUpdate.muteCoreId || collab.muteCoreId
          collab.displayName = collabUpdate.displayName || collab.displayName
          collab.login = collabUpdate.login || collab.login
          collab.email = collabUpdate.email || collab.email
          collab.avatar = collabUpdate.avatar || collab.avatar
          this.collaborators.set(collab.id, collab)
          this.updateSubject.next(collab)
        } else {
          this.collaborators.set(collabUpdate.id, collabUpdate)
          this.joinSubject.next(collabUpdate)
        }
      })
  }

  getCollaborator(muteCoreId: number): ICollaborator | undefined {
    for (const c of this.collaborators.values()) {
      if (c.muteCoreId === muteCoreId) {
        return c
      }
    }
    return undefined
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

  set joinSource(source: Observable<number>) {
    this.newSub = source.subscribe((id: number) => this.emitUpdate(id))
  }

  set leaveSource(source: Observable<number>) {
    this.newSub = source.subscribe((id: number) => {
      this.collaborators.delete(id)
      this.leaveSubject.next(id)
    })
  }

  set updateSource(source: Observable<ICollaborator>) {
    this.newSub = source.subscribe((data: ICollaborator) => {
      Object.assign(this.me, data)
      this.emitUpdate()
    })
  }

  dispose() {
    this.updateSubject.complete()
    this.joinSubject.complete()
    this.leaveSubject.complete()
    super.dispose()
  }

  private emitUpdate(recipientId?: number) {
    const data = Object.assign({}, this.me)
    delete data.id
    super.send(proto.Collaborator.encode(proto.Collaborator.create(data)).finish(), recipientId)
  }
}
