import test from 'ava'
import { ISwimPG } from '../src/collaborators/ICollaborator'
import { Piggyback } from '../src/collaborators/Piggyback'


/*
  Test les fonctions permettant de savoir qui est connecté
*/
test('connectedCollab', (context) => {
  context.plan(4)
  
  const piggyback : Piggyback = new Piggyback()
  piggyback.setValuePG(1, {
    collab: { id: 1 },
    message: 1,
    incarn: 0,
  })
  piggyback.setValuePG(2, {
    collab: { id: 2 },
    message: 1,
    incarn: 0,
  })
  piggyback.setValuePG(3, {
    collab: { id: 3 },
    message: 1,
    incarn: 0,
  })
  context.deepEqual(piggyback.getListConnectedCollab(), [1, 2, 3])
  context.deepEqual(piggyback.nbCollab(), 3)

  piggyback.setValuePG(3, {
    collab: { id: 3 },
    message: 4,
    incarn: 0,
  })
  context.deepEqual(piggyback.getListConnectedCollab(), [1, 2])
  context.deepEqual(piggyback.nbCollab(), 2)

})

/*
  Test de la fonction PGHas
*/
test('PGhasId', (context) => {
  context.plan(2)
  
  const piggyback : Piggyback = new Piggyback()
  piggyback.setValuePG(1, {
    collab: { id: 1 },
    message: 1,
    incarn: 0,
  })
  piggyback.setValuePG(2, {
    collab: { id: 2 },
    message: 1,
    incarn: 0,
  })

  context.deepEqual(piggyback.PGHas(1), true)
  context.deepEqual(piggyback.PGHas(4), false)
})


/*
  Tests de createToPG
*/
test('createToPG-normal', (context) => {
  context.plan(3)
  
  const piggyback : Piggyback = new Piggyback()
  piggyback.setValuePG(1, {
    collab: { id: 1 },
    message: 1,
    incarn: 0,
  })
  piggyback.setValuePG(2, {
    collab: { id: 2 },
    message: 1,
    incarn: 0,
  })
  piggyback.setValueCompteurPG(1)
  piggyback.setValueCompteurPG(2)
  let nbRebonds = piggyback.getCompteurPG().get(1)

  let newPg = piggyback.createToPG()
  context.deepEqual(newPg.get(1), {
    collab: { id: 1 },
    message: 1,
    incarn: 0,
  })
  if(nbRebonds !== undefined) {
    context.deepEqual(piggyback.getCompteurPG().get(1), nbRebonds-1)
  }
  context.deepEqual(newPg.get(2), {
    collab: { id: 2 },
    message: 1,
    incarn: 0,
  })
})
test('createToPG-compteur0', (context) => {
  context.plan(1)
  
  const piggyback : Piggyback = new Piggyback()
  piggyback.setValuePG(1, {
    collab: { id: 1 },
    message: 1,
    incarn: 0,
  })
  piggyback.setValuePG(2, {
    collab: { id: 2 },
    message: 3,
    incarn: 0,
  })
  let compteur = new Map<number, number>()
  compteur.set(1, 0)
  compteur.set(2, 0)
  piggyback.setNewCompteurPG(compteur)
  

  let newPg = piggyback.createToPG()
  context.deepEqual(newPg.get(2), {
    collab: { id: 2 },
    message: 3,
    incarn: 0,
  })
})


/*
  Tests de la fonction HandlePG
*/
test('handlePG-updateCollab&case_1', (context) => {
  context.plan(3)
  
  const piggyback : Piggyback = new Piggyback()
  piggyback.setValuePG(1, {
    collab: { id: 1 },
    message: 1,
    incarn: 0,
  })

  let pg = new Map<number, ISwimPG>()
  pg.set(1, {
    collab: { id: 1, login: 'oscar' },
    message: 1,
    incarn: 3,
  })
  pg.set(2, {
    collab: { id: 2 },
    message: 1,
    incarn: 0,
  })

  piggyback.handlePG(pg, {id : 1})
  context.deepEqual(piggyback.getPG().get(1), {
    collab: { id: 1, login: 'oscar' },
    message: 1,
    incarn: 0,
  })
  context.deepEqual(piggyback.PGHas(2), true)
  context.deepEqual(piggyback.getPG().get(2), {
    collab: { id: 2, },
    message: 1,
    incarn: 0,
  })
})
test('handlePG-&case_2', (context) => {
  context.plan(2)
  
  const piggyback : Piggyback = new Piggyback()
  piggyback.setValuePG(1, {
    collab: { id: 1 },
    message: 2,
    incarn: 0,
  })
  piggyback.setValuePG(2, {
    collab: { id: 2 },
    message: 2,
    incarn: 0,
  })

  let pg = new Map<number, ISwimPG>()
  pg.set(1, {
    collab: { id: 1 },
    message: 2,
    incarn: 0,
  })
  pg.set(2, {
    collab: { id: 2 },
    message: 2,
    incarn: 7,
  })

  piggyback.handlePG(pg, {id : 1})
  context.deepEqual(piggyback.getPG().get(1), {
    collab: { id: 1 },
    message: 2,
    incarn: 0,
  })
  context.deepEqual(piggyback.getPG().get(2), {
    collab: { id: 2, },
    message: 2,
    incarn: 7,
  })
})
test('handlePG-&case_3', (context) => {
  context.plan(2)
  
  const piggyback : Piggyback = new Piggyback()
  piggyback.setValuePG(1, {
    collab: { id: 1 },
    message: 2,
    incarn: 0,
  })
  piggyback.setValuePG(2, {
    collab: { id: 2 },
    message: 2,
    incarn: 0,
  })

  let pg = new Map<number, ISwimPG>()
  pg.set(1, {
    collab: { id: 1 },
    message: 3,
    incarn: 0,
  })
  pg.set(2, {
    collab: { id: 2 },
    message: 3,
    incarn: 2,
  })

  piggyback.handlePG(pg, {id : 1})
  context.deepEqual(piggyback.getPG().get(1), {
    collab: { id: 1 },
    message: 2,
    incarn: 1,
  })
  context.deepEqual(piggyback.getPG().get(2), {
    collab: { id: 2, },
    message: 3,
    incarn: 2,
  })
})
test('handlePG-&case_4', (context) => {
  context.plan(1)
  
  const piggyback : Piggyback = new Piggyback()
  piggyback.setValuePG(1, {
    collab: { id: 1 },
    message: 2,
    incarn: 0,
  })

  let pg = new Map<number, ISwimPG>()
  pg.set(1, {
    collab: { id: 1 },
    message: 4,
    incarn: 0,
  })

  piggyback.handlePG(pg, {id : 1})
  context.deepEqual(piggyback.getPG().get(1), {
    collab: { id: 1 },
    message: 4,
    incarn: 0,
  })
})

