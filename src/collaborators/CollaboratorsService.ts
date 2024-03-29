import { Observable, Subject } from 'rxjs'

import { IMessageIn, IMessageOut, Service } from '../misc'
import { collaborator as proto } from '../proto'
import { Streams, StreamsSubtype } from '../Streams'
import { ICollaborator } from './ICollaborator'

export class CollaboratorsService extends Service<proto.ICollaborator, proto.Collaborator> {
  public me: ICollaborator
  public collaborators: Map<number, ICollaborator>

  private updateSubject: Subject<ICollaborator>
  private joinSubject: Subject<ICollaborator>
  private leaveSubject: Subject<ICollaborator>

  constructor(
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    me: ICollaborator
  ) {
    super(messageIn$, messageOut$, Streams.COLLABORATORS, proto.Collaborator)
    this.me = me
    this.collaborators = new Map()
    this.updateSubject = new Subject()
    this.joinSubject = new Subject()
    this.leaveSubject = new Subject()

    this.newSub = this.messageIn$.subscribe(({ senderNetworkId, msg }) => {
      const updated = { ...msg }
      const collab = this.collaborators.get(senderNetworkId)

      if (collab) {
        collab.muteCoreId = updated.muteCoreId || collab.muteCoreId
        collab.displayName = updated.displayName || collab.displayName
        collab.login = updated.login || collab.login
        collab.email = updated.email || collab.email
        collab.avatar = updated.avatar || collab.avatar
        collab.deviceID = updated.deviceID || collab.deviceID
        this.updateSubject.next(collab)
      } else {
        this.collaborators.set(senderNetworkId, updated)
        this.joinSubject.next(updated)
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

  get remoteUpdate$(): Observable<ICollaborator> {
    return this.updateSubject.asObservable()
  }

  get join$(): Observable<ICollaborator> {
    return this.joinSubject.asObservable()
  }

  get leave$(): Observable<ICollaborator> {
    return this.leaveSubject.asObservable()
  }

  set memberJoin$(source: Observable<number>) {
    this.newSub = source.subscribe((networkId: number) =>
      this.emitUpdate(StreamsSubtype.COLLABORATORS_JOIN, networkId)
    )
  }

  set memberLeave$(source: Observable<number>) {
    this.newSub = source.subscribe((networkId: number) => {
      const collab = this.collaborators.get(networkId)
      if (collab) {
        this.leaveSubject.next(collab)
      }
      this.collaborators.delete(networkId)
    })
  }

  set localUpdate(source: Observable<ICollaborator>) {
    this.newSub = source.subscribe((data: ICollaborator) => {
      Object.assign(this.me, data)
      this.emitUpdate(StreamsSubtype.COLLABORATORS_LOCAL_UPDATE)
    })
  }

  dispose() {
    this.updateSubject.complete()
    this.joinSubject.complete()
    this.leaveSubject.complete()
    super.dispose()
  }

  private emitUpdate(subtype: StreamsSubtype, recipientNetworkId?: number) {
    const { ...rest } = this.me
    super.send(rest, subtype, recipientNetworkId)
  }
}
