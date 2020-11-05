import test from 'ava'
import { Subject } from 'rxjs'

import { CollaboratorsService } from '../src/collaborators'
import { IMessageIn, IMessageOut } from '../src/misc/IMessage'
import {
  ISwimAck,
  ISwimPG,
  ISwimPing,
  TYPE_ACK_LABEL,
  TYPE_PING_LABEL,
  TYPE_PINGREQ_LABEL,
  TYPE_PINGREQREP_LABEL,
  ISwimMessage,
  EnumNumPG
} from '../src/collaborators/ICollaborator'

// Ne pas oublier d'importer coef

// Pour les tests : utiliser des Streams(Subjects) intermédiaires auxquels on s'abonne et qui contiennent les messages du réseau au format des interfaces internes
// On pourrait ensuite reproduire les tests de prototype de manière relativement simple
// Il foudra ajouter des tests pour les modifications de données (pseudos...) et les encodages/décodages


/*
  Test réception d'un ping : on vérifie que CollabService renvoie un ack après avoir reçu un ping
*/
test('receptionPing', (context) => {
  context.plan(2)
  
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })

  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    context.deepEqual(msg.idCollab, 1) // Le destinataire du msg devrait être : 1
    context.deepEqual(msg.content.type, TYPE_ACK_LABEL) // Le type du message devrait être : ack
  })

  const pg = new Map<number, ISwimPG>()
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  collabService.setPG(pg)
  msgIntermediaireIn.next({idCollab: 1, content:{type: TYPE_PING_LABEL, piggyback: new Map<number, ISwimPG>()}})
})

/*
  Test réception d'un pingReq : on vérifie que CollabService envoie un ping à la target après réception d'un pingReq
*/
test('receptionPingReq', (context) => {
  context.plan(2)
  
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })

  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    context.deepEqual(msg.idCollab, 2)  // Le destinataire du msg devrait être 2
    context.deepEqual(msg.content.type, TYPE_PING_LABEL)  // Le type du message devrait être un ping
  })

  const pg = new Map<number, ISwimPG>()
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  collabService.setPG(pg)
  msgIntermediaireIn.next({idCollab: 1, content:{type: TYPE_PINGREQ_LABEL, numTarget: 2, piggyback: new Map<number, ISwimPG>()}})
})



/*
  Test de l'arrivée d'un nouveau collab : on vérifie que CollabService a ajouté le nouveau collab à sa liste
*/
test('joined', (context) => {
  context.plan(2)
  
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })

  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    context.deepEqual(collabService.getListConnectedCollab(), [0, 1])  // La liste des collaborateur
    context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
  })

  // On crée et on ajoute au Piggyback (pg) 
  const pg : Map<number, ISwimPG> = new Map<number, ISwimPG>()
  pg.set(0, {
    collab: collabService.me,
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  const ping: ISwimPing = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 1, content:ping})
})


/*
  Test de la suspicion d'un collab et de le déclaré dead par la suite : 
      on vérifie que CollabService a ajouté le nouveau collab à sa liste, qu'il reçoit un message pour le suspecté et un autre pour le déclarer dead et le supprimer
*/
test('suspect&confirm', (context) => {
  context.plan(4)
  
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })

  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  let cpt = 0

  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    switch(cpt){
      case 0:
        // 1 doit doit être suspecté
        context.deepEqual(collabService.getListConnectedCollab(), [0, 1])  // La liste des collaborateur
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack

        if(msg.content.type === TYPE_ACK_LABEL) {
          cpt++
          // On déclare le collab 1 dead
          pg.set(1, {
            collab: { id: 1 },
            message: EnumNumPG.Dead,
            incarn: 0,
          })
          ping = {type: TYPE_PING_LABEL, piggyback: pg}
          msgIntermediaireIn.next({idCollab: 1, content:ping})
        }
        break;
      case 1:
        // 1 doit doit être supprimé
        context.deepEqual(collabService.getListConnectedCollab(), [0])  // La liste des collaborateur
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
        break;
      default:
        context.fail("Défault du switch, le test a échoué")
    }  
  })

  // On crée et on ajoute au Piggyback (pg) 
  let pg : Map<number, ISwimPG> = new Map<number, ISwimPG>()
  pg.set(0, {
    collab: collabService.me,
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  collabService.setPG(pg)

  // On suspecte le collab 1
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Suspect,
    incarn: 0,
  })
  let ping: ISwimPing = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 2, content:ping})
})



/*
  Test du collab qui lève sa suspicion : on vérifie que CollabService ne supprime pas le collab suspecté précédement
*/
test('dementi', (context) => {
  context.plan(2)
  
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })

  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()


  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    context.deepEqual(collabService.getListConnectedCollab(), [0, 1])  // La liste des collaborateur
    context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
  })

  // On crée et on ajoute au Piggyback (pg) 
  const pg : Map<number, ISwimPG> = new Map<number, ISwimPG>()
  pg.set(0, {
    collab: collabService.me,
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Suspect,
    incarn: 0,
  })  // le collab 1 est suspect
  collabService.setPG(pg)

  // 1 démenti sa mort 
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Alive,
    incarn: 1,
  })
  msgIntermediaireIn.next({idCollab: 2, content: {type: TYPE_PING_LABEL, piggyback: pg}})
})


/*
  Test la bonne exécution du protocole SWIM --> envoie ping puis recoit ack
*/
test("pingProcedureOKdirect",(context)=>{
  context.plan(6);

  let cpt =0;

  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  
  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  let rep : ISwimPing | ISwimAck

  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    switch(cpt){
      case 0:  // On vérifie que que le collab envoie bien un ping à 1
        context.deepEqual(msg.idCollab, 1) // Le destinataire du ping devrait être 1
        context.deepEqual(msg.content.type, TYPE_PING_LABEL)  // Le type du message devrait être un ping
        context.deepEqual(collabService.getListConnectedCollab(),[0,1])

        if(msg.content.type === TYPE_PING_LABEL) {
          cpt++
          rep = {type: TYPE_ACK_LABEL, piggyback: pg};
          msgIntermediaireIn.next({idCollab: 1, content: rep}) // le collab reçoit un ack
          rep = {type: TYPE_PING_LABEL, piggyback: pg}
          msgIntermediaireIn.next({idCollab: 1, content: rep}) // le collab reçoit un ping
        }
        break;
      case 1:  // On vérifie que l'on renvoie bien un ack
        context.deepEqual(collabService.getListConnectedCollab(),[0,1])
        context.deepEqual(msg.idCollab, 1) // Le destinataire du ack devrait être 1
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack  
        break;
      default:
        context.is(true,false);
    }
  })

  const pg : Map<number, ISwimPG> = new Map<number, ISwimPG>()
  pg.set(0, {
    collab: collabService.me,
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  collabService.setPG(pg)

  collabService.pingProcedure(1);
})



/*
  Test la bonne exécution du protocole SWIM avec intermédiaire --> ping sans réponse, puis pingReq qui va récupérer un ack
*/
test("pingProcedureOKindirect",async context=>{
  context.plan(6);

  let cpt = 0;

  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  
  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  let idCollabCible: number = 0
  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    switch(cpt){
      case 0:  // On véfirie que pingProcedure envoie un ping à un autre collaborateur
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_PING_LABEL)  // Le type du message devrait être un ping
        idCollabCible = msg.idCollab

        if(msg.content.type === TYPE_PING_LABEL) {
          cpt++
          let pingReq: ISwimMessage
          if(idCollabCible === 1) {
            pingReq = {idCollab: 2, content:  {type: TYPE_PINGREQREP_LABEL, answer: true, piggyback: pg}}
          } else {
            pingReq = {idCollab: 1, content:  {type: TYPE_PINGREQREP_LABEL, answer: true, piggyback: pg}}
          } 
          msgIntermediaireIn.next(pingReq)  // Envoie de la réponse du pingReq
        }
        break
      case 1:  // On vérifie que pingProcedure envoie un pingReq
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_PINGREQ_LABEL)  // Le type du message devrait être un pingreq
        if(msg.content.type === TYPE_PINGREQ_LABEL) {
          if(idCollabCible === 2) {
            context.deepEqual(msg.idCollab, 1) // Le destinataire du pingreq devrait être 1
            context.deepEqual(msg.content.numTarget, 2) // La cible du pingreq devrait être 2
          } else {
            context.deepEqual(msg.idCollab, 2) // Le destinataire du pingreq devrait être 2
            context.deepEqual(msg.content.numTarget, 1) // La cible du pingreq devrait être 1   
          }
        }  
        break
      default:
          context.is(true,false)
    }
  })
    
  // On crée le PG avec l'état de tous les collab
  const pg : Map<number, ISwimPG> = new Map<number, ISwimPG>()
  pg.set(0, {
    collab: collabService.me,
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  pg.set(2, {
    collab: { id: 2 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  collabService.setPG(pg)

  // On attend que collabService lance la pingProcedure() par lui même
  await delay(6000)
  
})


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}



/*
  Test la bonne exécution du protocole SWIM avec intermédiaire --> ping sans réponse, puis pingReq sans réponse 
*/
test("pingProcedureKO",async context=>{
  context.plan(6);

  let cpt =0;

  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  
  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  let idCollabCible: number = 0
  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    switch(cpt){
      case 0:  // On véfirie que pingProcedure envoie un ping à un autre collaborateur
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_PING_LABEL)  // Le type du message devrait être un ping
        idCollabCible = msg.idCollab

        if(msg.content.type === TYPE_PING_LABEL) {
          cpt++
          let pingReq: ISwimMessage
          if(idCollabCible === 1) {
            pingReq = {idCollab: 2, content:  {type: TYPE_PINGREQREP_LABEL, answer: false, piggyback: pg}}
          } else {
            pingReq = {idCollab: 1, content:  {type: TYPE_PINGREQREP_LABEL, answer: false, piggyback: pg}}
          } 
          msgIntermediaireIn.next(pingReq)  // Envoie de la réponse du pingReq
        }
        break
      case 1:  // On vérifie que pingProcedure envoie un pingReq
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_PINGREQ_LABEL)  // Le type du message devrait être un pingreq
        if(msg.content.type === TYPE_PINGREQ_LABEL) {
          if(idCollabCible === 2) {
            context.deepEqual(msg.idCollab, 1) // Le destinataire du pingreq devrait être 1
            context.deepEqual(msg.content.numTarget, 2) // La cible du pingreq devrait être 2
          } else {
            context.deepEqual(msg.idCollab, 2) // Le destinataire du pingreq devrait être 2
            context.deepEqual(msg.content.numTarget, 1) // La cible du pingreq devrait être 1   
          }
        }  
        break
      default:
          context.is(true,false)
    }
  })


  const pg : Map<number, ISwimPG> = new Map<number, ISwimPG>()
  pg.set(0, {
    collab: collabService.me,
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  pg.set(1, {
    collab: { id: 1 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  pg.set(2, {
    collab: { id: 2 },
    message: EnumNumPG.Alive,
    incarn: 0,
  })
  collabService.setPG(pg)

  // On attend que collabService lance la pingProcedure() par lui même
  await delay(6000)
})