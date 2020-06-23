import { Observable, Subject } from 'rxjs'

import { IMessageIn, IMessageOut, Service } from '../misc'
import { isObject } from '../misc/util'
import { collaborator as proto } from '../proto'
import { Streams, StreamsSubtype } from '../Streams'
import { ICollaborator, ISwim, ISwimDataRequest, TYPE_DATAREQUEST_LABEL } from './ICollaborator'

function wrapToProto(msg: ISwim): proto.SwimMsg {
  return {
    [msg.type]: msg,
  }
}

function isICollaborator(o: unknown): o is ICollaborator {
  return (
    isObject<ICollaborator>(o) &&
    typeof o.id === 'number' &&
    (typeof o.muteCoreId === 'number' || o.muteCoreId === undefined) &&
    (typeof o.displayName === 'string' || o.displayName === undefined) &&
    (typeof o.login === 'string' || o.login === undefined) &&
    (typeof o.email === 'string' || o.email === undefined) &&
    (typeof o.avatar === 'string' || o.avatar === undefined) &&
    (typeof o.deviceID === 'string' || o.deviceID === undefined)
  )
}

export class CollaboratorsService extends Service<proto.ISwimMsg, proto.SwimMsg> {
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
    super(messageIn$, messageOut$, Streams.COLLABORATORS, proto.SwimMsg)
    this.me = me
    this.collaborators = new Map()
    this.updateSubject = new Subject()
    this.joinSubject = new Subject()
    this.leaveSubject = new Subject()

    // this.newSub = this.messageIn$.subscribe(({ senderId, msg }) => {
    //   const updated = { id: senderId, ...msg }
    //   const collab = this.collaborators.get(senderId)
    //   if (collab) {
    //     collab.muteCoreId = updated.muteCoreId || collab.muteCoreId
    //     collab.displayName = updated.displayName || collab.displayName
    //     collab.login = updated.login || collab.login
    //     collab.email = updated.email || collab.email
    //     collab.avatar = updated.avatar || collab.avatar
    //     collab.deviceID = updated.deviceID || collab.deviceID
    //     this.updateSubject.next(collab)
    //   } else {
    //     this.collaborators.set(updated.id, updated)
    //     this.joinSubject.next(updated)
    //   }
    // })

    this.newSub = this.messageIn$.subscribe(({ senderId, msg }) => {
      console.log('CollaboratorService: received message from: ', senderId)
      console.log('CollaboratorService: msg: ', msg)
      if (msg.swimDataRequest) {
        const type = TYPE_DATAREQUEST_LABEL
        const collab = { id: senderId, ...msg.swimDataRequest.collab }
        if (isICollaborator(collab)) {
          const dataRequest: ISwimDataRequest = { type, collab }
          console.log('CollaboratorService: unwrapped msg: ', dataRequest)
          this.joinSubject.next(collab)
        }
      }
    })

    setInterval(() => {
      const msg: ISwimDataRequest = { type: TYPE_DATAREQUEST_LABEL, collab: this.me }
      super.send(wrapToProto(msg), StreamsSubtype.COLLABORATORS_SWIM, 0)
    }, 3000)
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

  // set memberJoin$(source: Observable<number>) {
  //   this.newSub = source.subscribe((id: number) =>
  //     this.emitUpdate(StreamsSubtype.COLLABORATORS_JOIN, id)
  //   )
  // }

  // set memberLeave$(source: Observable<number>) {
  //   this.newSub = source.subscribe((id: number) => {
  //     const collab = this.collaborators.get(id)
  //     if (collab) {
  //       this.leaveSubject.next(collab)
  //     }
  //     this.collaborators.delete(id)
  //   })
  // }

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

  private emitUpdate(subtype: StreamsSubtype, recipientId?: number) {
    // const { id, ...rest } = this.me
    // super.send(rest, subtype, recipientId)
    console.log('subtype: ', subtype)
    console.log('recipientId', recipientId)
  }
}
