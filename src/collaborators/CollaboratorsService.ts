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
import { Piggyback } from './Piggyback'

const nbPR = 2
export const coef = 800

/*
Commentaires : 
- L'appli semble bien fonctionner avec très peu d'utilisateurs (4,5 max), ensuite des bugs graves apparaissent
- La méthode dispose ne semble pas être appellée / dispose est appellée quand on ne peut plus envoyer de message
- Tests unitaires manquants

- Le collaborateur s'ajoute lui même au PG à partir du momeent où l'UI lui envoie les informations de l'utilisateur.
Si l'utilisateur modifie son profil, son numéro incarn est réinitialiser à 0 ==> cela peut être source de bugs, les autres collab peuveunt croire que les messages envoyé sont des vieux messages et les ignorer
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
  let numTarget = -1
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
  let answer = false
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

  private updateSubject: Subject<ICollaborator> // Permet d'informer l'UI qu'un collab a mis à jour ses infos
  private joinSubject: Subject<ICollaborator> // Permet d'informer l'UI qu'un collab a rejoint 
  private leaveSubject: Subject<ICollaborator> // Permet d'informer l'UI qu'un collab a quitté

  private piggyback: Piggyback

  private incarnation: number
  private reponse: boolean
  private gossip: boolean

  private messageISwimIn$: Subject<ISwimMessage>
  private messageISwimOut$: Subject<ISwimMessage>

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

    this.piggyback = new Piggyback()

    this.incarnation = 0
    this.reponse = false
    this.gossip = true

    this.messageISwimIn$ = new Subject()
    this.messageISwimOut$ = new Subject()


    /*
      Bug dans la getion des messages :
      - On lit les messages des inconnus comme ceux des collaborateurs connus
      (comportement un peu illogique qui génère des bugs comme tout le monde pense que je suis dans le réseau mais je pense être seul)
      A voir comment modifier, en essayant tout simplement d'ajouter une condition (sur tous les messages sauf DataRequest/DataUpdate), l'application suit mal (j'avais peut-être loupé mon implem quand j'ai testé)...
      */
    /*
      Récupération des messages reçus (format : proto.SwimMsg) ==> Transformation du message au format ISwimMessage
      Envoie du message vers messageISwimIn$ pour le traitement
    */
    this.newSub = this.messageIn$.subscribe(({ senderId, msg }) => {
      console.log('CollaboratorService: received message from: ', senderId)
      console.log('CollaboratorService: msg: ', msg)

      if (msg.swimDataRequest) {  /* Data Request */      
        const collab = { id: senderId, ...msg.swimDataRequest.collab }
        if (isICollaborator(collab)) {
          this.messageISwimIn$.next({idCollab: senderId, content: {type : TYPE_DATAREQUEST_LABEL, collab: collab}})
        }
      } else if (msg.swimDataUpdate) {  /* Date Update */
          this.messageISwimIn$.next({idCollab: senderId, content: unwrapFromProtoDataUpdate(msg.swimDataUpdate)})

      } else if (msg.swimPing) {  /* Ping */
          this.messageISwimIn$.next({idCollab: senderId, content: unwrapFromProtoPing(msg.swimPing)})

      } else if (msg.swimAck) {  /* Ack */
          this.messageISwimIn$.next({idCollab: senderId, content: unwrapFromProtoAck(msg.swimAck)})

      } else if (msg.swimPingReq) {  /* Ping Req */
          this.messageISwimIn$.next({idCollab: senderId, content: unwrapFromProtoPingReq(msg.swimPingReq)})
         
      } else if (msg.swimPingReqRep) {  /* Ping Req Reponse */
        this.messageISwimIn$.next({idCollab: senderId, content: unwrapFromProtoPingReqRep(msg.swimPingReqRep)})
   
      } else {  /* Error */
          console.log('ERROR unknow message : ', { senderId, msg })    
      }
      
    })


    /*
      Récupération des messages reçus (format : ISwim) ==> Traitement du message en fonction du type
    */
    this.newSub = this.messageISwimIn$.subscribe((msg: ISwimMessage) => {  
      if (msg.content.type === TYPE_DATAREQUEST_LABEL) {  /* Data Request */
        if (msg.content.collab) {
          if (!this.piggyback.PGHas(msg.idCollab)) {
            this.piggyback.setValuePG(msg.idCollab, { collab: msg.content.collab, message: 1, incarn: this.incarnation })
            this.piggyback.setValueCompteurPG(msg.idCollab)
            this.joinSubject.next(msg.content.collab)
          }
          this.envoyerDataUpdate(msg.idCollab) // attendre avant d'envoyer? DEBUG
        }
        
      } else if (msg.content.type === TYPE_DATAUPDATE_LABEL) {  /* Date Update */
        if (msg.content.PG.size > this.piggyback.getSizePG()) {
          this.updateUI(
            Array.from(msg.content.PG.values())
              .filter((a) => a.message !== 4)
              .map((a) => a.collab)
          )
          this.piggyback.setNewPG(msg.content.PG)
          this.piggyback.setNewCompteurPG(msg.content.compteurPG)
        }

      } else if (msg.content.type === TYPE_PING_LABEL) {  /* Ping */
        this.piggyback.handlePG(msg.content.piggyback, this.me)   // HANDLE \\
        this.envoyerAck(msg.idCollab)

      } else if (msg.content.type === TYPE_ACK_LABEL) {  /* Ack */
        this.piggyback.handlePG(msg.content.piggyback, this.me)   // HANDLE \\
        this.reponse = true

      } else if (msg.content.type === TYPE_PINGREQ_LABEL) {  /* Ping Req */ 
        this.piggyback.handlePG(msg.content.piggyback, this.me)   // HANDLE \\
        if (msg.content.numTarget) {
          this.envoyerPing(msg.content.numTarget)
        } else {
          console.log('numTarger error')
        }
        this.reponse = false
        setTimeout(
          function(this: CollaboratorsService) {
            this.envoyerReponsePingReq(msg.idCollab, this.reponse)
          }.bind(this),
          coef
        )

      } else if (msg.content.type === TYPE_PINGREQREP_LABEL) {  /* Ping Req Reponse */
        this.piggyback.handlePG(msg.content.piggyback, this.me)   // HANDLE \\
        if (msg.content.answer) {
          this.reponse = msg.content.answer
        }

      } else {  /* Error */
        console.log('ERROR unknow message : ', msg)    
      }
    })

    /*
      Transformation et envoie d'un message (format ISwim => proto.SwimMsg)
    */
    this.messageISwimOut$.subscribe((msg: ISwimMessage) => {
      const wrapped = wrapToProto(msg.content)
      console.log('sent: ', wrapped)
      super.send(wrapped, StreamsSubtype.COLLABORATORS_SWIM, msg.idCollab)
    })

/**
this.newSub = this.messageIn$.subscribe(({ senderId, msg }) => {
      console.log('CollaboratorService: received message from: ', senderId)
      console.log('CollaboratorService: msg: ', msg)
      
      if (msg.swimDataRequest) {
        // const type = TYPE_DATAREQUEST_LABEL
        const collab = { id: senderId, ...msg.swimDataRequest.collab }
        if (isICollaborator(collab)) {
          // const dataRequest: ISwimDataRequest = { type, collab }
          if (!this.PG.has(senderId)) {
            this.PG.set(senderId, { collab, message: 1, incarn: this.incarnation })
            this.compteurPG.set(senderId)
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
    
    /**
     * Exécutée toutes les 5 * coef millisecondes
     * Lance une pingPorcedure avec un nombre aléatoire
     */
    setInterval(() => {
      if (this.gossip) {
        if (this.piggyback.nbCollab() <= 1) {
          this.envoyerDataRequest()
        } else {
          let pg = this.piggyback.getPG()
          const collaborators = Array.from(pg.values())
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



  } // Fin constructor

  handlePG(piggyback: Map<number, ISwimPG>) {
    console.log('handlePG function')
    for (const [key, elem] of piggyback) {
      console.log('PG : ', key, elem)
      // Update collab properties
      if (this.piggyback.PGHas(key) && elem.incarn >= this.piggyback.getValueByKeyPG(key)!.incarn) {
        const PGEntry = this.piggyback.getValueByKeyPG(key)!
        if (PGEntry.collab !== elem.collab) {
          PGEntry.collab = elem.collab
          this.piggyback.setValuePG(key, PGEntry)
          this.updateSubject.next(PGEntry.collab)
        }
      }
      // Evaluate PG message
      switch (elem.message) {
        case 1: // Joined
          if (!this.piggyback.PGHas(key)) {
            this.joinSubject.next(elem.collab)
            this.piggyback.setValuePG(key, elem)
            this.piggyback.setValueCompteurPG(key)
          }
          break
        case 2: // Alive
          if (this.piggyback.PGHas(key) && elem.incarn > this.piggyback.getValueByKeyPG(key)!.incarn) {
            this.piggyback.setValuePG(key, elem)
            this.piggyback.setValueCompteurPG(key)
          }
          break
        case 3: // Suspect
          if (key === this.me.id) {
            this.incarnation++
            this.piggyback.setValuePG(this.me.id, { collab: this.me, message: 2, incarn: this.incarnation })
            this.piggyback.setValueCompteurPG(this.me.id)
          } else {
            if (this.piggyback.PGHas(key)) {
              let overide = false
              if (this.piggyback.getValueByKeyPG(key) === undefined) {
                overide = true
              } else if (
                this.piggyback.getValueByKeyPG(key)!.message === 3 &&
                elem.incarn > this.piggyback.getValueByKeyPG(key)!.incarn
              ) {
                overide = true
              } else if (
                (this.piggyback.getValueByKeyPG(key)!.message === 1 || this.piggyback.getValueByKeyPG(key)!.message === 2) &&
                elem.incarn >= this.piggyback.getValueByKeyPG(key)!.incarn
              ) {
                overide = true
              }
              if (overide) {
                this.piggyback.setValuePG(key, elem)
                this.piggyback.setValueCompteurPG(key)
              }
            }
          }
          break
        case 4: // Confirm
          if (this.piggyback.PGHas(key) && this.piggyback.getValueByKeyPG(key)!.message !== 4) {
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
            this.piggyback.setValuePG(key, elem)
            this.piggyback.setValueCompteurPG(key)
          }
          break
      }
    }
  }

  // Parfois, un collaborateur est ajouté en trop à l'interface
  updateUI(collabs: ICollaborator[]): void {
    const collabConnus: ICollaborator[] = []
    let pg = this.piggyback.getPG()
    pg.forEach((x) => {
      collabConnus.push(x.collab)
    })
    collabs.forEach((x) => {
      if (!collabConnus.includes(x) && x.id !== this.me.id) {
        this.joinSubject.next(x)
      }
    })
  }

  envoyerDataRequest() {
    const mess: ISwimDataRequest = { type: TYPE_DATAREQUEST_LABEL, collab: this.me }
    this.messageISwimOut$.next({idCollab: 0, content: mess})
  }

  envoyerDataUpdate(numDest: number) {
    const mess: ISwimDataUpdate = {
      type: TYPE_DATAUPDATE_LABEL,
      PG: this.piggyback.getPG(),
      compteurPG: this.piggyback.getCompteurPG(),
    }

    this.messageISwimOut$.next({idCollab: numDest, content: mess})
  }

  envoyerPing(numDest: number) {
    const toPG: Map<number, ISwimPG> = this.piggyback.createToPG()
    const mess: ISwimPing = { type: TYPE_PING_LABEL, piggyback: toPG }
    
    this.messageISwimOut$.next({idCollab: numDest, content: mess})
  }

  envoyerPingReq(numDest: number, numTarget: number) {
    const toPG: Map<number, ISwimPG> = this.piggyback.createToPG()
    const mess: ISwimPingReq = { type: TYPE_PINGREQ_LABEL, numTarget, piggyback: toPG }

    this.messageISwimOut$.next({idCollab: numDest, content: mess})
  }

  envoyerAck(numDest: number) {
    const toPG: Map<number, ISwimPG> = this.piggyback.createToPG()
    const mess: ISwimAck = { type: TYPE_ACK_LABEL, piggyback: toPG }

    this.messageISwimOut$.next({idCollab: numDest, content: mess})
  }

  envoyerReponsePingReq(numDest: number, answer: boolean) {
    const toPG: Map<number, ISwimPG> = this.piggyback.createToPG()
    const mess: ISwimPingReqRep = { type: TYPE_PINGREQREP_LABEL, answer, piggyback: toPG }
    
    this.messageISwimOut$.next({idCollab: numDest, content: mess})
  }


  pingProcedure(numCollab: number) {
    this.envoyerPing(numCollab)
    this.reponse = false
    setTimeout(
      function(this: CollaboratorsService) {
        let incarnActu: number = 0
        if (this.piggyback.PGHas(numCollab)) {
          incarnActu = this.piggyback.getValueByKeyPG(numCollab)!.incarn
        }
        if (!this.reponse) {
          let idx = nbPR
          let pg = this.piggyback.getPG()
          const collaborators = Array.from(pg.values())
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
              if (!this.reponse) {
                if (this.piggyback.PGHas(numCollab)) {
                  if (this.piggyback.getValueByKeyPG(numCollab)!.message === 1 || this.piggyback.getValueByKeyPG(numCollab)!.message === 2) {
                    this.piggyback.setValuePG(numCollab, {
                      collab: this.piggyback.getValueByKeyPG(numCollab)!.collab,
                      message: 3,
                      incarn: incarnActu,
                    })
                    this.piggyback.setValueCompteurPG(numCollab)
                  } else if (this.piggyback.getValueByKeyPG(numCollab)!.message === 3) {
                    this.leaveSubject.next(this.piggyback.getValueByKeyPG(numCollab)!.collab)
                    this.piggyback.setValuePG(numCollab, {
                      collab: this.piggyback.getValueByKeyPG(numCollab)!.collab,
                      message: 4,
                      incarn: incarnActu,
                    })
                    this.piggyback.setValueCompteurPG(numCollab)
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

  /**
   * Retourne le collab qui a pour id mute-core celui qui est passé en paramètre
   * @param muteCoreId du collaborateur recherché
   */
  getCollaborator(muteCoreId: number): ICollaborator | undefined {
    return this.piggyback.getCollaborator(muteCoreId)
  }

  get remoteUpdate$(): Observable<ICollaborator> {
    return this.piggyback.remoteUpdate$
  }

  get join$(): Observable<ICollaborator> {
    return this.piggyback.join$
  }

  get leave$(): Observable<ICollaborator> {
    return this.piggyback.leave$
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
      this.piggyback.deleteValuePG(this.me.id)
      this.piggyback.deleteValueCompteurPG(this.me.id)
      Object.assign(this.me, data)
      this.piggyback.setValuePG(this.me.id, { collab: this.me, message: 1, incarn: 0 })
      this.piggyback.setValueCompteurPG(this.me.id)
      console.log(this.me)
      console.log(this.piggyback.getPG())
      console.log(this.piggyback.getCompteurPG())
      this.emitUpdate(StreamsSubtype.COLLABORATORS_LOCAL_UPDATE)
    })
  }

  dispose() {
    this.piggyback.setValuePG(this.me.id, { collab: this.me, message: 4, incarn: this.incarnation })
    this.piggyback.setValueCompteurPG(this.me.id)
    this.envoyerPing(0)
    this.gossip = false

    this.piggyback.completeSubject()
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
    return this.messageISwimIn$;
  }

  getStreamIntermediaireOut() {
    return this.messageISwimOut$;
  }

  /**
   * Retourne la liste des collaborateurs connectés
   */
  getListConnectedCollab() : number[] {
    return this.piggyback.getListConnectedCollab()
  }

  /**
   * Set une nouvelle map à pg dans Piggyback
   * @param pg nouvelle Map<number, ISwimPG>
   */
  setPG(pg : Map<number, ISwimPG>) {
    this.piggyback.setNewPG(pg)
  }

}
