import { Observable, Subject } from 'rxjs'

import { IMessageIn, IMessageOut, Service } from '../misc'
import { isObject } from '../misc/util'
import { collaborator as proto } from '../proto'
import { Streams, StreamsSubtype } from '../Streams'
import {
  ICollaborator,
  ISwim,
  ISwimDataRequest,
  ISwimDataUpdate,
  ISwimPG,
  TYPE_DATAREQUEST_LABEL,
  TYPE_DATAUPDATE_LABEL,
} from './ICollaborator'

function wrapToProto(msg: ISwim): proto.SwimMsg {
  return {
    [msg.type]: msg,
  }
}

function unwrapFromProtoDataUpdate(swimDataUpdate: proto.ISwimDataUpdate): ISwimDataUpdate {
  const type = TYPE_DATAUPDATE_LABEL
  const PG: Map<number, ISwimPG> = new Map()
  const compteurPG: Map<number, number> = new Map()
  if (swimDataUpdate && swimDataUpdate.PG) {
    swimDataUpdate.PG.forEach((x) => {
      const obj = { id: x.id, ...x.swimPG.collab }
      if (isICollaborator(obj)) {
        const collab: ICollaborator = obj
        const PGEntry: ISwimPG = { collab, message: x.swimPG.message, incarn: x.swimPG.incarn }
        PG.set(x.id, PGEntry)
      } else {
        console.log('error : unwrapFromProtoDataUpdate')
      }
    })
  }
  for (const key in swimDataUpdate.compteurPG) {
    if (swimDataUpdate.compteurPG.hasOwnProperty(key)) {
      compteurPG.set(parseInt(key, 10), swimDataUpdate.compteurPG[key])
    }
  }
  return { type, PG, compteurPG }
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

  private updateSubject: Subject<ICollaborator>
  private joinSubject: Subject<ICollaborator>
  private leaveSubject: Subject<ICollaborator>

  private PG: Map<number, ISwimPG>
  private compteurPG: Map<number, number>
  private incarnation: number

  constructor(
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    me: ICollaborator
  ) {
    super(messageIn$, messageOut$, Streams.COLLABORATORS, proto.SwimMsg)
    this.me = me
    this.updateSubject = new Subject()
    this.joinSubject = new Subject()
    this.leaveSubject = new Subject()

    this.PG = new Map<number, ISwimPG>()
    this.compteurPG = new Map<number, number>()
    this.incarnation = 0

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
      const K: number = this.calculNbRebond()
      // console.log('CollaboratorService: received message from: ', senderId)
      // console.log('CollaboratorService: msg: ', msg)
      if (msg.swimDataRequest) {
        const type = TYPE_DATAREQUEST_LABEL
        const collab = { id: senderId, ...msg.swimDataRequest.collab }
        if (isICollaborator(collab)) {
          const dataRequest: ISwimDataRequest = { type, collab }
          console.log('CollaboratorService: unwrapped msg: ', dataRequest)
          // console.log("senderId : ", senderId)
          // console.log("this.PG : ", this.PG)
          if (!this.PG.has(senderId)) {
            this.PG.set(senderId, { collab, message: 1, incarn: this.incarnation })
            this.compteurPG.set(senderId, K)
            this.envoyerDataUpdate(senderId)
            this.joinSubject.next(collab)
          }
        }
      } else if (msg.swimDataUpdate) {
        const dataUpdate = unwrapFromProtoDataUpdate(msg.swimDataUpdate)
        if (dataUpdate.PG.size > 0) {
          this.PG = dataUpdate.PG
          this.compteurPG = dataUpdate.compteurPG
        }
      } else {
        // gérer les PG (handlePG) et les autres messages
        console.log('ERROR unknow message : ', { senderId, msg })
      }
    })

    setInterval(() => {
      const msg: ISwimDataRequest = { type: TYPE_DATAREQUEST_LABEL, collab: this.me }
      super.send(wrapToProto(msg), StreamsSubtype.COLLABORATORS_SWIM, 0)
    }, 3000)
  }

  calculNbRebond() {
    return Math.ceil(3 * Math.log2(this.nbCollab() + 1))
  }

  nbCollab() {
    let nb = 0
    this.PG.forEach((x) => {
      if (x.message !== 4) {
        nb++
      }
    })
    return nb
  }

  envoyerDataUpdate(numDest: number) {
    const mess: ISwimDataUpdate = {
      type: TYPE_DATAUPDATE_LABEL,
      PG: this.PG,
      compteurPG: this.compteurPG,
    }
    console.log('envoi Data Update : ', mess)
    super.send(wrapToProto(mess), StreamsSubtype.COLLABORATORS_SWIM, numDest)
  }

  getCollaborator(muteCoreId: number): ICollaborator | undefined {
    for (const c of this.PG.values()) {
      if (c.collab.muteCoreId === muteCoreId) {
        return c.collab
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
      this.PG.delete(this.me.id)
      this.compteurPG.delete(this.me.id)
      Object.assign(this.me, data)
      this.PG.set(this.me.id, { collab: this.me, message: 1, incarn: 0 })
      this.compteurPG.set(this.me.id, this.calculNbRebond())
      console.log(this.me)
      console.log(this.PG)
      console.log(this.compteurPG)
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
