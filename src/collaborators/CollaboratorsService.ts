import { Observable, Subject } from 'rxjs'

import { IMessageIn, IMessageOut, Service } from '../misc'
import { isObject } from '../misc/util'
import { collaborator as proto } from '../proto'
import { Streams, StreamsSubtype } from '../Streams'
import {
  ICollaborator,
  ISwim,
  ISwimAck,
  ISwimDataRequest,
  ISwimDataUpdate,
  ISwimPG,
  ISwimPing,
  ISwimPingReq,
  ISwimPingReqRep,
  TYPE_ACK_LABEL,
  TYPE_DATAREQUEST_LABEL,
  TYPE_DATAUPDATE_LABEL,
  TYPE_PING_LABEL,
  TYPE_PINGREQ_LABEL,
  TYPE_PINGREQREP_LABEL,
  ISwimMessage,
} from './ICollaborator'

const nbPR = 2
export const coef = 800

/*
Commentaires : 
- L'appli semble bien fonctionner avec très peu d'utilisateurs (4,5 max), ensuite des bugs graves apparaissent
- La méthode dispose ne semble pas être appellée / dispose est appellée quand on ne peut plus envoyer de message
- Tests unitaires manquants
*/


/*
  Convertit un message ISwim au format proto.swimMsg
*/
function wrapToProto(msg: ISwim): proto.SwimMsg {
  const res: proto.SwimMsg = { [msg.type]: msg }
  if (msg.type === 'swimDataUpdate' && msg.PG) {
    const varPG = new Array<proto.ISwimPGEntry>()
    for (const [key, elem] of msg.PG) {
      varPG.push({ id: key, swimPG: elem })
    }
    if (varPG && res.swimDataUpdate) {
      res.swimDataUpdate.PG = varPG
    }
  } else if ((msg.type === 'swimPing' || msg.type === 'swimAck') && msg.piggyback) {
    const varPG = new Array<proto.ISwimPGEntry>()
    for (const [key, elem] of msg.piggyback) {
      varPG.push({ id: key, swimPG: elem })
    }
    if (varPG && res.swimPing) {
      res.swimPing.piggyback = varPG
    } else if (varPG && res.swimAck) {
      res.swimAck.piggyback = varPG
    }
  }
  return res
}


/*
  Unwrap proto.ISwimDataUpdate ==> ISwimDataUpdate
*/
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
  } else {
    console.log('error : unwrapFromProtoDataUpdate')
  }
  for (const key in swimDataUpdate.compteurPG) {
    if (swimDataUpdate.compteurPG.hasOwnProperty(key)) {
      compteurPG.set(parseInt(key, 10), swimDataUpdate.compteurPG[key])
    }
  }
  return { type, PG, compteurPG }
}


/*
  Unwrap proto.ISwimPing ==> ISwimPing
*/
function unwrapFromProtoPing(swimPing: proto.ISwimPing): ISwimPing {
  const type = TYPE_PING_LABEL
  const piggyback: Map<number, ISwimPG> = new Map()
  if (swimPing && swimPing.piggyback) {
    swimPing.piggyback.forEach((x) => {
      const obj = { id: x.id, ...x.swimPG.collab }
      if (isICollaborator(obj)) {
        const collab: ICollaborator = obj
        const PGEntry: ISwimPG = { collab, message: x.swimPG.message, incarn: x.swimPG.incarn }
        piggyback.set(x.id, PGEntry)
      } else {
        console.log('error : unwrapFromProtoPing')
      }
    })
  } else {
    console.log('error : unwrapFromProtoPing')
  }
  return { type, piggyback }
}


/*
  Unwrap proto.ISwimPingReq ==> ISwimPingReq
*/
function unwrapFromProtoPingReq(swimPing: proto.ISwimPingReq): ISwimPingReq {
  const type = TYPE_PINGREQ_LABEL
  var numTarget = -1
  const piggyback: Map<number, ISwimPG> = new Map()

  if (swimPing && swimPing.piggyback && swimPing.numTarget) {
    numTarget = swimPing.numTarget
    swimPing.piggyback.forEach((x) => {
      const obj = { id: x.id, ...x.swimPG.collab }
      if (isICollaborator(obj)) {
        const collab: ICollaborator = obj
        const PGEntry: ISwimPG = { collab, message: x.swimPG.message, incarn: x.swimPG.incarn }
        piggyback.set(x.id, PGEntry)
      } else {
        console.log('error : unwrapFromProtoPingReq')
      }
    })
  } else {
    console.log('error : unwrapFromProtoPingReq')
  }
  return { type, numTarget, piggyback }
}


/*
  Unwrap proto.ISwimPingReqRep ==> ISwimPingReqRep
*/
function unwrapFromProtoPingReqRep(swimPing: proto.ISwimPingReqRep): ISwimPingReqRep {
  const type = TYPE_PINGREQREP_LABEL
  var answer = false
  const piggyback: Map<number, ISwimPG> = new Map()

  if (swimPing && swimPing.piggyback && swimPing.answer) {
    answer = swimPing.answer
    swimPing.piggyback.forEach((x) => {
      const obj = { id: x.id, ...x.swimPG.collab }
      if (isICollaborator(obj)) {
        const collab: ICollaborator = obj
        const PGEntry: ISwimPG = { collab, message: x.swimPG.message, incarn: x.swimPG.incarn }
        piggyback.set(x.id, PGEntry)
      } else {
        console.log('error : unwrapFromProtoPingReq')
      }
    })
  } else {
    console.log('error : unwrapFromProtoPingReq')
  }
  return { type, answer, piggyback }
}


/*
  Unwrap proto.ISwimAck ==> ISwimAck
*/
function unwrapFromProtoAck(swimAck: proto.ISwimAck): ISwimAck {
  const type = TYPE_ACK_LABEL
  const piggyback: Map<number, ISwimPG> = new Map()
  if (swimAck && swimAck.piggyback) {
    swimAck.piggyback.forEach((x) => {
      const obj = { id: x.id, ...x.swimPG.collab }
      if (isICollaborator(obj)) {
        const collab: ICollaborator = obj
        const PGEntry: ISwimPG = { collab, message: x.swimPG.message, incarn: x.swimPG.incarn }
        piggyback.set(x.id, PGEntry)
      } else {
        console.log('error : unwrapFromProtoAck')
      }
    })
  } else {
    console.log('error : unwrapFromProtoAck')
  }
  return { type, piggyback }
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
  private reponse: boolean
  private gossip: boolean

  private messageTestIn$: Subject<ISwimMessage>
  private messageTestOut$: Subject<ISwimMessage>

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
    this.reponse = false
    this.gossip = true

    this.messageTestIn$ = new Subject()
    this.messageTestOut$ = new Subject()


    /*
      Bug dans la getion des messages :
      - On lit les messages des inconnus comme ceux des collaborateurs connus
      (comportement un peu illogique qui génère des bugs comme tout le monde pense que je suis dans le réseau mais je pense être seul)
      A voir comment modifier, en essayant tout simplement d'ajouter une condition (sur tous les messages sauf DataRequest/DataUpdate), l'application suit mal (j'avais peut-être loupé mon implem quand j'ai testé)...
      */
    /*
      Récupération des messages reçus (format : proto.SwimMsg) ==> Transformation du message au format ISwimMessage
      Envoie du message vers messageTestIn$ pour le traitement
    */
    this.newSub = this.messageIn$.subscribe(({ senderId, msg }) => {
      console.log('CollaboratorService: received message from: ', senderId)
      console.log('CollaboratorService: msg: ', msg)

      if (msg.swimDataRequest) {  /* Data Request */      
        const collab = { id: senderId, ...msg.swimDataRequest.collab }
        if (isICollaborator(collab)) {
          this.messageTestIn$.next({idCollab: senderId, content: {type : TYPE_DATAREQUEST_LABEL, collab: collab}})
        }
      } else if (msg.swimDataUpdate) {  /* Date Update */
          this.messageTestIn$.next({idCollab: senderId, content: unwrapFromProtoDataUpdate(msg.swimDataUpdate)})

      } else if (msg.swimPing) {  /* Ping */
          this.messageTestIn$.next({idCollab: senderId, content: unwrapFromProtoPing(msg.swimPing)})

      } else if (msg.swimAck) {  /* Ack */
          this.messageTestIn$.next({idCollab: senderId, content: unwrapFromProtoAck(msg.swimAck)})

      } else if (msg.swimPingReq) {  /* Ping Req */
          this.messageTestIn$.next({idCollab: senderId, content: unwrapFromProtoPingReq(msg.swimPingReq)})
         
      } else if (msg.swimPingReqRep) {  /* Ping Req Reponse */
        this.messageTestIn$.next({idCollab: senderId, content: unwrapFromProtoPingReqRep(msg.swimPingReqRep)})
   
      } else {  /* Error */
          console.log('ERROR unknow message : ', { senderId, msg })    
      }
      
    })

    this.newSub = this.messageTestIn$.subscribe(({ idCollab, content }) => {
      
      if (content.type == TYPE_DATAREQUEST_LABEL) {  /* Data Request */
        if (content.collab) {
          const K: number = this.calculNbRebond()
          if (!this.PG.has(idCollab)) {
            this.PG.set(idCollab, { collab: content.collab, message: 1, incarn: this.incarnation })
            this.compteurPG.set(idCollab, K)
            this.joinSubject.next(content.collab)
          }
          this.envoyerDataUpdate(idCollab) // attendre avant d'envoyer? DEBUG
        }
        

      } else if (content.type == TYPE_DATAUPDATE_LABEL) {  /* Date Update */
        if (content.PG.size > this.PG.size) {
          this.updateUI(
            Array.from(content.PG.values())
              .filter((a) => a.message !== 4)
              .map((a) => a.collab)
          )
          this.PG = content.PG
          this.compteurPG = content.compteurPG
        }
      } else if (content.type == TYPE_PING_LABEL) {  /* Ping */
        this.handlePG(content.piggyback)
        this.envoyerAck(idCollab)

      } else if (content.type == TYPE_ACK_LABEL) {  /* Ack */
        this.handlePG(content.piggyback)
        this.reponse = true

      } else if (content.type == TYPE_PINGREQ_LABEL) {  /* Ping Req */ 
        this.handlePG(content.piggyback)
        if (content.numTarget) {
          this.envoyerPing(content.numTarget)
        } else {
          console.log('numTarger error')
        }
        this.reponse = false
        setTimeout(
          function(this: CollaboratorsService) {
            this.envoyerReponsePingReq(idCollab, this.reponse)
          }.bind(this),
          coef
        )

      } else if (content.type == TYPE_PINGREQREP_LABEL) {  /* Ping Req Reponse */
        this.handlePG(content.piggyback)
        if (content.answer) {
          this.reponse = content.answer
        }

      } else {  /* Error */
        console.log('ERROR unknow message : ', { idCollab, content })    
      }
      

    })

/**
this.newSub = this.messageIn$.subscribe(({ senderId, msg }) => {
      const K: number = this.calculNbRebond()
      console.log('CollaboratorService: received message from: ', senderId)
      console.log('CollaboratorService: msg: ', msg)
      
      if (msg.swimDataRequest) {
        // const type = TYPE_DATAREQUEST_LABEL
        const collab = { id: senderId, ...msg.swimDataRequest.collab }
        if (isICollaborator(collab)) {
          // const dataRequest: ISwimDataRequest = { type, collab }
          if (!this.PG.has(senderId)) {
            this.PG.set(senderId, { collab, message: 1, incarn: this.incarnation })
            this.compteurPG.set(senderId, K)
            this.joinSubject.next(collab)
          }
          this.envoyerDataUpdate(senderId) // attendre avant d'envoyer? DEBUG
        }
      } else if (msg.swimDataUpdate) {
        const dataUpdate = unwrapFromProtoDataUpdate(msg.swimDataUpdate)
        if (dataUpdate.PG.size > this.PG.size) {
          this.updateUI(
            Array.from(dataUpdate.PG.values())
              .filter((a) => a.message !== 4)
              .map((a) => a.collab)
          )
          this.PG = dataUpdate.PG
          this.compteurPG = dataUpdate.compteurPG
        }
      } else {
        if (msg.swimPing) {
          this.handlePG(unwrapFromProtoPing(msg.swimPing).piggyback)
          this.envoyerAck(senderId)
        } else if (msg.swimAck) {
          this.handlePG(unwrapFromProtoAck(msg.swimAck).piggyback)
          this.reponse = true
        } else if (msg.swimPingReq) {
          this.handlePG(unwrapFromProtoPing(msg.swimPingReq).piggyback)
          if (msg.swimPingReq.numTarget) {
            this.envoyerPing(msg.swimPingReq.numTarget)
          } else {
            console.log('numTarger error')
          }

          this.reponse = false
          setTimeout(
            function(this: CollaboratorsService) {
              this.envoyerReponsePingReq(senderId, this.reponse)
            }.bind(this),
            coef
          )
        } else if (msg.swimPingReqRep) {
          this.handlePG(unwrapFromProtoPing(msg.swimPingReqRep).piggyback)
          if (msg.swimPingReqRep.answer) {
            this.reponse = msg.swimPingReqRep.answer
          }
        } else {
          console.log('ERROR unknow message : ', { senderId, msg })
        }
      }
    })
*/
    

    setInterval(() => {
      // console.log(this.PG)
      // console.log(this.compteurPG)
      if (this.gossip) {
        if (this.nbCollab() <= 1) {
          this.envoyerDataRequest()
        } else {
          const collaborators = Array.from(this.PG.values())
            .filter((a) => a.message !== 4)
            .map((a) => a.collab)
          const ens: Set<number> = new Set(collaborators.map((a) => a.id))
          ens.delete(this.me.id)
          const numRandom = Math.floor(Math.random() * ens.size)
          const numCollab = Array.from(ens)[numRandom]

          this.pingProcedure(numCollab)
        }
      }
    }, 5 * coef)
  }

  calculNbRebond() {
    return Math.ceil(3 * Math.log2(this.nbCollab() + 1))
  }

  handlePG(piggyback: Map<number, ISwimPG>) {
    const K = this.calculNbRebond()
    console.log('handlePG function')
    for (const [key, elem] of piggyback) {
      console.log('PG : ', key, elem)
      // Update collab properties
      if (this.PG.has(key) && elem.incarn >= this.PG.get(key)!.incarn) {
        const PGEntry = this.PG.get(key)!
        if (PGEntry.collab !== elem.collab) {
          PGEntry.collab = elem.collab
          this.PG.set(key, PGEntry)
          this.updateSubject.next(PGEntry.collab)
        }
      }
      // Evaluate PG message
      switch (elem.message) {
        case 1: // Joined
          if (!this.PG.has(key)) {
            this.joinSubject.next(elem.collab)
            this.PG.set(key, elem)
            this.compteurPG.set(key, K)
          }
          break
        case 2: // Alive
          if (this.PG.has(key) && elem.incarn > this.PG.get(key)!.incarn) {
            this.PG.set(key, elem)
            this.compteurPG.set(key, K)
          }
          break
        case 3: // Suspect
          if (key === this.me.id) {
            this.incarnation++
            this.PG.set(this.me.id, { collab: this.me, message: 2, incarn: this.incarnation })
            this.compteurPG.set(this.me.id, K)
          } else {
            if (this.PG.has(key)) {
              let overide = false
              if (this.PG.get(key) === undefined) {
                overide = true
              } else if (
                this.PG.get(key)!.message === 3 &&
                elem.incarn > this.PG.get(key)!.incarn
              ) {
                overide = true
              } else if (
                (this.PG.get(key)!.message === 1 || this.PG.get(key)!.message === 2) &&
                elem.incarn >= this.PG.get(key)!.incarn
              ) {
                overide = true
              }
              if (overide) {
                this.PG.set(key, elem)
                this.compteurPG.set(key, K)
              }
            }
          }
          break
        case 4: // Confirm
          if (this.PG.has(key) && this.PG.get(key)!.message !== 4) {
            if (key === this.me.id) {
              console.log("You've been declared dead")
              this.dispose()
              /*
              Procédure envisgeable pour rejoindre à nouveau le réseau :
              (- Attendre quelques périodes)
              - Envoyer un nouveau data-request
              - Reçevoir les données du réseau et vérifier si on a des informations à transmettre au groupe
              - Créer PG et compteur PG à partir des données du réseau (et ajouter nos entrées à transmettre si besoin)

              -> Pour l'instant, Joined ne permet pas d'override Confirm
              */
            }
            this.leaveSubject.next(elem.collab)
            this.PG.set(key, elem)
            this.compteurPG.set(key, K)
          }
          break
      }
    }
  }

  // Parfois, un collaborateur est ajouté en trop à l'interface
  updateUI(collabs: ICollaborator[]): void {
    const collabConnus: ICollaborator[] = []
    this.PG.forEach((x) => {
      collabConnus.push(x.collab)
    })
    collabs.forEach((x) => {
      if (!collabConnus.includes(x) && x.id !== this.me.id) {
        this.joinSubject.next(x)
      }
    })
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

  envoyerDataRequest() {
    const msg: ISwimDataRequest = { type: TYPE_DATAREQUEST_LABEL, collab: this.me }
    const wrapped = wrapToProto(msg)
    console.log('sent: ', wrapped)
    super.send(wrapped, StreamsSubtype.COLLABORATORS_SWIM, 0)
  }

  envoyerDataUpdate(numDest: number) {
    const mess: ISwimDataUpdate = {
      type: TYPE_DATAUPDATE_LABEL,
      PG: this.PG,
      compteurPG: this.compteurPG,
    }
    const wrapped = wrapToProto(mess)
    console.log('sent: ', wrapped)
    super.send(wrapped, StreamsSubtype.COLLABORATORS_SWIM, numDest)
  }

  envoyerPing(numDest: number) {
    const toPG: Map<number, ISwimPG> = this.createToPG()
    const mess: ISwimPing = { type: TYPE_PING_LABEL, piggyback: toPG }
    const wrapped = wrapToProto(mess)
    console.log('sent: ', wrapped)
    super.send(wrapped, StreamsSubtype.COLLABORATORS_SWIM, numDest)
  }

  envoyerPingReq(numDest: number, numTarget: number) {
    const toPG: Map<number, ISwimPG> = this.createToPG()
    const mess: ISwimPingReq = { type: TYPE_PINGREQ_LABEL, numTarget, piggyback: toPG }
    const wrapped = wrapToProto(mess)
    console.log('sent: ', wrapped)
    super.send(wrapped, StreamsSubtype.COLLABORATORS_SWIM, numDest)
  }

  envoyerAck(numDest: number) {
    const toPG: Map<number, ISwimPG> = this.createToPG()
    const mess: ISwimAck = { type: TYPE_ACK_LABEL, piggyback: toPG }
    const wrapped = wrapToProto(mess)
    console.log('sent: ', wrapped)
    super.send(wrapped, StreamsSubtype.COLLABORATORS_SWIM, numDest)
  }

  envoyerReponsePingReq(numDest: number, answer: boolean) {
    const toPG: Map<number, ISwimPG> = this.createToPG()
    const mess: ISwimPingReqRep = { type: TYPE_PINGREQREP_LABEL, answer, piggyback: toPG }
    const wrapped = wrapToProto(mess)
    console.log('sent: ', wrapped)
    super.send(wrapped, StreamsSubtype.COLLABORATORS_SWIM, numDest)
  }

  createToPG() {
    const toPG: Map<number, ISwimPG> = new Map<number, ISwimPG>()
    if (this.compteurPG !== undefined) {
      for (const [key, value] of this.PG) {
        if (this.compteurPG.get(key)! > 0) {
          this.compteurPG.set(key, this.compteurPG.get(key)! - 1)
          toPG.set(key, value)
        } else if (this.PG.get(key)!.message === 3) {
          toPG.set(key, value)
        }
      }
    }
    return toPG
  }

  pingProcedure(numCollab: number) {
    this.envoyerPing(numCollab)
    this.reponse = false
    setTimeout(
      function(this: CollaboratorsService) {
        let incarnActu: number = 0
        if (this.PG.has(numCollab)) {
          incarnActu = this.PG.get(numCollab)!.incarn
        }
        if (!this.reponse) {
          let idx = nbPR
          const collaborators = Array.from(this.PG.values())
            .filter((a) => a.message !== 4)
            .map((a) => a.collab)
          if (idx > collaborators.length - 2) {
            idx = collaborators.length - 2
          }
          const ens: Set<number> = new Set(collaborators.map((a) => a.id))
          ens.delete(this.me.id)
          ens.delete(numCollab)
          while (idx > 0) {
            const numRandom = Math.floor(Math.random() * ens.size)
            const numCollabReq = Array.from(ens)[numRandom]
            ens.delete(numCollabReq)
            this.envoyerPingReq(numCollabReq, numCollab)
            idx--
          }
          clearTimeout()
          setTimeout(
            function(this: CollaboratorsService) {
              const K: number = this.calculNbRebond()
              if (!this.reponse) {
                if (this.PG.has(numCollab)) {
                  if (
                    this.PG.get(numCollab)!.message === 1 ||
                    this.PG.get(numCollab)!.message === 2
                  ) {
                    this.PG.set(numCollab, {
                      collab: this.PG.get(numCollab)!.collab,
                      message: 3,
                      incarn: incarnActu,
                    })
                    this.compteurPG.set(numCollab, K)
                  } else if (this.PG.get(numCollab)!.message === 3) {
                    this.leaveSubject.next(this.PG.get(numCollab)!.collab)
                    this.PG.set(numCollab, {
                      collab: this.PG.get(numCollab)!.collab,
                      message: 4,
                      incarn: incarnActu,
                    })
                    this.compteurPG.set(numCollab, K)
                  }
                }
              }
            }.bind(this),
            3 * coef
          )
        }
      }.bind(this),
      coef
    )
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
    const K: number = this.calculNbRebond()
    this.PG.set(this.me.id, { collab: this.me, message: 4, incarn: this.incarnation })
    this.compteurPG.set(this.me.id, K)
    this.envoyerPing(0)
    this.gossip = false

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



  


  getStreamIntermediaireIn() {
    return this.messageTestIn$;
  }

  getStreamIntermediaireOut() {
    return this.messageTestOut$;
  }


}
