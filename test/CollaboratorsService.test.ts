import test from 'ava'
import { Subject } from 'rxjs'
//import { map } from 'rxjs/operators'

import { CollaboratorsService } from '../src/collaborators'
import { IMessageIn, IMessageOut } from '../src/misc/IMessage'
import {
  ISwimAck,
  ISwimPG,
  ISwimPing,
  //ISwimPingReq,
  TYPE_ACK_LABEL,
  TYPE_PING_LABEL,
  TYPE_PINGREQ_LABEL,
  TYPE_PINGREQREP_LABEL,
  ISwimMessage,
} from '../src/collaborators/ICollaborator'

/*test.failing('pseudos-correct-send-and-delivery', (context) => {
  const id = 42
  const msgOut1 = new Subject<IMessageOut>()
  const cs1 = new CollaboratorsService(new Subject<IMessageIn>(), msgOut1, { id })

  const cs2 = new CollaboratorsService(
    msgOut1.pipe(
      map((msg) => {
        const { recipientId, ...rest } = msg
        return { senderId: recipientId || 0, ...rest }
      })
    ),
    new Subject<IMessageOut>(),
    { id: 43 }
  )

  const expectedUpdates = [
    { id, displayName: 'Hello' },
    { id, displayName: 'There,' },
    { id, displayName: 'How' },
    { id, displayName: 'Are' },
    { id, displayName: 'You?' },
  ]
  setTimeout(() => {
    cs1.localUpdate = from(expectedUpdates)
    cs1.dispose()
    cs2.dispose()
  })

  context.plan((expectedUpdates.length - 1) * 2)
  let counter = 1
  return cs2.remoteUpdate$.pipe(
    map(({ id, displayName }) => {
      context.is(id, id)
      context.is(displayName, expectedUpdates[counter].displayName)
      counter++
    })
  )
})

test.failing('peers-joining-correct-delivery', (context) => {
  const msgOut1 = new Subject<IMessageOut>()
  const cs1 = new CollaboratorsService(new Subject<IMessageIn>(), msgOut1, { id: 0 })

  const expectedIds = [{ id: 3 }, { id: 1 }, { id: 7 }, { id: 42 }, { id: 80 }]
  let i = -1
  const cs2 = new CollaboratorsService(
    msgOut1.pipe(
      map((msg) => {
        i++
        const { recipientId, ...rest } = msg
        return { senderId: expectedIds[i].id || 0, ...rest }
      })
    ),
    new Subject<IMessageOut>(),
    { id: 0 }
  )

  setTimeout(() => {
    cs1.localUpdate = from(expectedIds)
    cs1.dispose()
    cs2.dispose()
  })

  context.plan(expectedIds.length)
  let counter = 0
  return cs2.join$.pipe(map(({ id }) => context.is(id, expectedIds[counter++].id)))
})
*/
/*
test.failing('init', (context) => {
  const msgOut1 = new Subject<IMessageOut>()
  const msgOut2 = new Subject<IMessageOut>()
  const cs1 = new CollaboratorsService(
    msgOut2.pipe(
      map((msg) => {
        const { recipientId, ...rest } = msg
        return { senderId: 2, ...rest }
      })
    ),
    msgOut1,
    { id: 1 }
  )
  const cs2 = new CollaboratorsService(
    msgOut1.pipe(
      map((msg) => {
        const { recipientId, ...rest } = msg
        return { senderId: 1, ...rest }
      })
    ),
    msgOut2,
    { id: 2 }
  )

  setTimeout(() => {
    // DEBUG Tester data-request / data-update
    // Tester juste les données internes pour init?
    cs1.dispose()
    cs2.dispose()
  }, 5 * coef)
})
*/
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

  msgIntermediaireIn.next({idCollab: 1, content:{type: TYPE_PING_LABEL, piggyback: collabService.createToPG()}})
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

  msgIntermediaireIn.next({idCollab: 1, content:{type: TYPE_PINGREQ_LABEL, numTarget: 2, piggyback: collabService.createToPG()}})
})



/*
  Test de l'arrivée d'un nouveau collab : on vérifie que CollabService a ajouté le nouveau collab à sa liste
*/
test('joined', (context) => {
  context.plan(2)
  
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  const msgOut1 = new Subject<IMessageOut>()
  const msgIn1 = new Subject<IMessageIn>()
  const collabService1 = new CollaboratorsService(msgIn1, msgOut1, { id: 1 })

  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    context.deepEqual(collabService.getListConnectedCollab(), [0, 1])  // La liste des collaborateur
    context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
  })

  // On crée et on ajoute au Piggyback (pg) 
  const pg : Map<number, ISwimPG> = collabService.createToPG()
  pg.set(0, {
    collab: collabService.me,
    message: 1,
    incarn: 0,
  })
  pg.set(1, {
    collab: collabService1.me,
    message: 1,
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
  context.plan(6)
  
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  const msgOut1 = new Subject<IMessageOut>()
  const msgIn1 = new Subject<IMessageIn>()
  const collabService1 = new CollaboratorsService(msgIn1, msgOut1, { id: 1 })

  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  let cpt = 0

  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    switch(cpt){
      case 0:
        // 1 doit doit être ajouté
        context.deepEqual(collabService.getListConnectedCollab(), [0, 1])  // La liste des collaborateur
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
        break;
      case 1:
        // 1 doit doit être suspecté
        context.deepEqual(collabService.getListConnectedCollab(), [0, 1])  // La liste des collaborateur
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
        break;
      case 2:
        // 1 doit doit être supprimé
        context.deepEqual(collabService.getListConnectedCollab(), [0])  // La liste des collaborateur
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
        break;
      default:
        context.fail("Défault du switch, le test a échoué")
    }  
    cpt++
  })

  // On crée et on ajoute au Piggyback (pg) 
  let pg : Map<number, ISwimPG> = collabService.createToPG()
  pg.set(0, {
    collab: collabService.me,
    message: 1,
    incarn: 0,
  })
  pg.set(1, {
    collab: collabService1.me,
    message: 1,
    incarn: 0,
  })
  let ping: ISwimPing = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 1, content:ping})
  // On suspecte le collab 1
  pg.set(1, {
    collab: collabService1.me,
    message: 3,
    incarn: 0,
  })
  ping = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 2, content:ping})
  // On déclare le collab 1 dead
  pg.set(1, {
    collab: collabService1.me,
    message: 4,
    incarn: 0,
  })
  ping = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 2, content:ping})
})



/*
  Test du collab qui lève sa suspicion : on vérifie que CollabService ne supprime pas le collab suspecté précédement
*/
test('dementi', (context) => {
  context.plan(6)
  
  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  const msgOut1 = new Subject<IMessageOut>()
  const msgIn1 = new Subject<IMessageIn>()
  const collabService1 = new CollaboratorsService(msgIn1, msgOut1, { id: 1 })

  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()


  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    context.deepEqual(collabService.getListConnectedCollab(), [0, 1])  // La liste des collaborateur
    context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
  })

  // On crée et on ajoute au Piggyback (pg) 
  const pg : Map<number, ISwimPG> = collabService.createToPG()
  pg.set(0, {
    collab: collabService.me,
    message: 1,
    incarn: 0,
  })
  pg.set(1, {
    collab: collabService1.me,
    message: 1,
    incarn: 0,
  })
  let ping: ISwimPing = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 1, content:ping})
  // On suspecte le collab 1
  pg.set(1, {
    collab: collabService1.me,
    message: 3,
    incarn: 0,
  })
  ping = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 2, content:ping})
  // 1 démenti sa mort 
  pg.set(1, {
    collab: collabService1.me,
    message: 2,
    incarn: 1,
  })
  ping = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 2, content:ping})
})


/*
  Test la bonne exécution du protocole SWIM --> envoie ping puis recoit ack
*/
test("pingProcedureOKdirect",(context)=>{
  context.plan(9);

  let cpt =0;

  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  const msgOut1 = new Subject<IMessageOut>()
  const msgIn1 = new Subject<IMessageIn>()
  const collabService1 = new CollaboratorsService(msgIn1, msgOut1, { id: 1 })
  
  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    switch(cpt){
      case 0:  // On vérifie que les collab ont été ajouté
      context.deepEqual(collabService.getListConnectedCollab(),[0, 1])
      context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
      context.deepEqual(msg.idCollab, 1) // Le destinataire du ack devrait être 1
        break;
      case 1:  // On vérifie que que le collab envoie bien un ping à 1
        context.deepEqual(msg.idCollab, 1) // Le destinataire du ping devrait être 1
        context.deepEqual(msg.content.type, TYPE_PING_LABEL)  // Le type du message devrait être un ping
        context.deepEqual(collabService.getListConnectedCollab(),[0,1])
        break;
      case 2:  // On vérifie que l'on renvoie bien un ack
        context.deepEqual(collabService.getListConnectedCollab(),[0,1])
        context.deepEqual(msg.idCollab, 1) // Le destinataire du ack devrait être 1
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack  
        break;
      default:
        context.is(true,false);
    }
    cpt++
  })

  let rep : ISwimPing | ISwimAck
  const pg : Map<number, ISwimPG> = collabService.createToPG()
  pg.set(0, {
    collab: collabService.me,
    message: 1,
    incarn: 0,
  })
  pg.set(1, {
    collab: collabService1.me,
    message: 1,
    incarn: 0,
  })
  msgIntermediaireIn.next({idCollab: 1, content:{type: TYPE_PING_LABEL, piggyback: pg}}) // On vient ajouter le collab 1
  collabService.pingProcedure(1);
  rep = {type: TYPE_ACK_LABEL, piggyback: pg};
  msgIntermediaireIn.next({idCollab: 1, content: rep}) // le collab reçoit un ack
  rep = {type: TYPE_PING_LABEL, piggyback: pg}
  msgIntermediaireIn.next({idCollab: 1, content: rep}) // le collab reçoit un ping
})



/*
  Test la bonne exécution du protocole SWIM avec intermédiaire --> ping sans réponse, puis pingReq qui va récupérer un ack
*/
test("pingProcedureOKindirect",async context=>{
  context.plan(9);

  let cpt = 0;

  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  const msgOut1 = new Subject<IMessageOut>()
  const msgIn1 = new Subject<IMessageIn>()
  const collabService1 = new CollaboratorsService(msgIn1, msgOut1, { id: 1 })
  const msgOut2 = new Subject<IMessageOut>()
  const msgIn2 = new Subject<IMessageIn>()
  const collabService2 = new CollaboratorsService(msgIn2, msgOut2, { id: 2 })
  
  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  let idCollabCible: number = 0
  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    switch(cpt){
      case 0:  // On vérifie que les collab ont été ajouté
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
        context.deepEqual(msg.idCollab, 1) // Le destinataire du ack devrait être 1
        break
      case 1:  // On véfirie que pingProcedure envoie un ping à un autre collaborateur
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_PING_LABEL)  // Le type du message devrait être un ping
        idCollabCible = msg.idCollab
        break
      case 2:  // On vérifie que pingProcedure envoie un pingReq
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
  cpt++
  })
    
  // On crée le PG avec l'état de tous les collab
  const pg : Map<number, ISwimPG> = collabService.createToPG()
  pg.set(0, {
    collab: collabService.me,
    message: 1,
    incarn: 0,
  })
  pg.set(1, {
    collab: collabService1.me,
    message: 1,
    incarn: 0,
  })
  pg.set(2, {
    collab: collabService2.me,
    message: 1,
    incarn: 0,
  })

  msgIntermediaireIn.next({idCollab: 1, content:{type: TYPE_PING_LABEL, piggyback: pg}}) // On vient ajouter less collab 1 et 2
  // On attend que collabService lance la pingProcedure() par lui même
  await delay(6000)
  let pingReq: ISwimMessage
  if(idCollabCible === 1) {
    pingReq = {idCollab: 2, content:  {type: TYPE_PINGREQREP_LABEL, answer: true, piggyback: pg}}
  } else {
    pingReq = {idCollab: 1, content:  {type: TYPE_PINGREQREP_LABEL, answer: true, piggyback: pg}}
  } 
  msgIntermediaireIn.next(pingReq)  // Envoie de la réponse du pingReq
})


function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}






test("pingProcedureKO",async context=>{
  context.plan(9);

  let cpt =0;

  const msgOut = new Subject<IMessageOut>()
  const msgIn = new Subject<IMessageIn>()
  const collabService = new CollaboratorsService(msgIn, msgOut, { id: 0 })
  const msgOut1 = new Subject<IMessageOut>()
  const msgIn1 = new Subject<IMessageIn>()
  const collabService1 = new CollaboratorsService(msgIn1, msgOut1, { id: 1 })
  const msgOut2 = new Subject<IMessageOut>()
  const msgIn2 = new Subject<IMessageIn>()
  const collabService2 = new CollaboratorsService(msgIn2, msgOut2, { id: 2 })
  
  const msgIntermediaireIn = collabService.getStreamIntermediaireIn()
  const msgIntermediaireOut = collabService.getStreamIntermediaireOut()

  let idCollabCible: number = 0
  msgIntermediaireOut.subscribe((msg: ISwimMessage) => {
    switch(cpt){
      case 0:  // On vérifie que les collab ont été ajouté
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_ACK_LABEL)  // Le type du message devrait être un ack
        context.deepEqual(msg.idCollab, 1) // Le destinataire du ack devrait être 1
        break
      case 1:  // On véfirie que pingProcedure envoie un ping à un autre collaborateur
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_PING_LABEL)  // Le type du message devrait être un ping
        idCollabCible = msg.idCollab
        break
      case 2:  // On vérifie que pingProcedure envoie un pingReq
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
      /*case 3:  // On véfirie que pingProcedure envoie un ping à un autre collaborateur
        context.deepEqual(collabService.getListConnectedCollab(),[0, 1, 2])
        context.deepEqual(msg.content.type, TYPE_PING_LABEL)  // Le type du message devrait être un ping
        break
      case 4:  // On vérifie que pingProcedure envoie un pingReq
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
        break*/
      default:
          context.is(true,false)
    }
  cpt++
  })


  const pg : Map<number, ISwimPG> = collabService.createToPG()
  pg.set(0, {
    collab: collabService.me,
    message: 1,
    incarn: 0,
  })
  pg.set(1, {
    collab: collabService1.me,
    message: 1,
    incarn: 0,
  })
  pg.set(2, {
    collab: collabService2.me,
    message: 1,
    incarn: 0,
  })
  msgIntermediaireIn.next({idCollab: 1, content:{type: TYPE_PING_LABEL, piggyback: pg}}) // On vient ajouter less collab 1 et 2
  // On attend que collabService lance la pingProcedure() par lui même
  await delay(6000)
  let pingReq: ISwimMessage
  if(idCollabCible === 1) {
    pingReq = {idCollab: 2, content:  {type: TYPE_PINGREQREP_LABEL, answer: false, piggyback: pg}}
  } else {
    pingReq = {idCollab: 1, content:  {type: TYPE_PINGREQREP_LABEL, answer: false, piggyback: pg}}
  } 
  msgIntermediaireIn.next(pingReq)  // Envoie de la réponse du pingReq

  /*collabService.pingProcedure(idCollabCible)
  msgIntermediaireIn.next(pingReq)
  msgIntermediaireIn.next({idCollab: 1, content:{type: TYPE_PING_LABEL, piggyback: pg}})*/
})