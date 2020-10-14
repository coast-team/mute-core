import { Observable, Subject } from 'rxjs'
import { 
    ISwimPG,
    ICollaborator
} from './ICollaborator'


export class Piggyback {
    private PG : Map<number, ISwimPG>  // Map qui associe à l'id d'un collaborateur son état (1: Joined, 2: Alive, 3: Suspect, 4: Confirm)
    private compteurPG : Map<number, number> // Map qui associe à l'id d'un collaborateur le nombre de fois pù la modification de son état doit être ajouté au PG

    private subjectCollabJoin: Subject<ICollaborator>  // Permet d'être informé lorsqu'un Collaborator rejoint 
    private subjectCollabUbdate: Subject<ICollaborator>  // Permet d'être informé lorsqu'un Collaborator met à jour ses infos 
    private subjectCollabLeave: Subject<ICollaborator>  // Permet de tenir informé CollabService qu'un Collaborator a quitté

    constructor() {
        this.PG = new Map<number, ISwimPG>()
        this.compteurPG = new Map<number, number>()

        this.subjectCollabJoin = new Subject()
        this.subjectCollabUbdate = new Subject()
        this.subjectCollabLeave = new Subject() 
    }

    /**
     * Ajoute une valeur au PG
     * @param idCollab : id du Icollaborateur
     * @param etat : état du collab (format ISwimPG)
     */
    setValuePG(idCollab: number, etat: ISwimPG) {
        this.PG.set(idCollab, etat)
    }

    /**
     * Set le champ PG avec le paramètre de la fonction 
     * @param pg nouvelle Map<number, ISwimPG>
     */
    setNewPG(pg : Map<number, ISwimPG>) {
      this.PG = pg
    }

    /**
     * Retourne le PG
     */
    getPG() {
        return this.PG
    }

    /**
     * Supprime dans PG la valeur correspondante à la clé passée en param
     * @param idCollab id du collaborateur
     */
    deleteValuePG(idCollab: number) {
        this.PG.delete(idCollab)
    }

    /**
     * Retourne la taille du PG
     */
    getSizePG() : number {
        return this.PG.size
    }
    
    /**
     * Retourne true si le collaborateur est dans le PG
     * @param idCollab id du collaborateur recherché dans le PG
     */
    PGHas(idCollab: number) {
        return this.PG.has(idCollab)
    }

    /**
     * Retourne l'état du collaborateur (ou undefined si la clé n'existe pas)
     * @param key id d'un collaborateur
     */
    getValueByKeyPG(key: number) {
        return this.PG.get(key)
    }
    
    
    /**
     * Ajoute une valeur à compteurPG
     * @param idCollab : id du Icollaborateur
     */
    setValueCompteurPG(idCollab: number) {
        this.compteurPG.set(idCollab, this.calculNbRebond())
    }

    /**
     * Set le champ compteurPG avec le paramètre de la fonction 
     * @param cptPG nouvelle Map<number, number>
     */
    setNewCompteurPG(cptPG : Map<number, number>) {
      this.compteurPG = cptPG
    }

    /**
    * Retourne le compteurPG
    */
    getCompteurPG() {
        return this.compteurPG
    }
    
    /**
     * Supprime dans compteurPG la valeur correspondante à la clé passée en param
     * @param idCollab id du collaborateur
     */
    deleteValueCompteurPG(idCollab: number) {
        this.compteurPG.delete(idCollab)
    }

   /**
    * Retourne un PG avec les infos qui doivent être transmise
    */
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


  handlePG(piggyback: Map<number, ISwimPG>, me: ICollaborator) {
    console.log('handlePG function')
    for (const [key, elem] of piggyback) {
      console.log('PG : ', key, elem)
      // Update collab properties
      if (this.PGHas(key) && elem.incarn >= this.getValueByKeyPG(key)!.incarn) {
        const PGEntry = this.getValueByKeyPG(key)!
        if (PGEntry.collab !== elem.collab) {
          PGEntry.collab = elem.collab
          this.setValuePG(key, PGEntry)
          this.subjectCollabUbdate.next(PGEntry.collab)
        }
      }
      // Evaluate PG message
      switch (elem.message) {
        case 1: // Joined
          if (!this.PGHas(key)) {
            this.setValuePG(key, elem)
            this.setValueCompteurPG(key)
            this.subjectCollabJoin.next(elem.collab)
          }
          break
        case 2: // Alive
          if (this.PGHas(key) && elem.incarn > this.getValueByKeyPG(key)!.incarn) {
            this.setValuePG(key, elem)
            this.setValueCompteurPG(key)
          }
          break
        case 3: // Suspect
          if (key === me.id) {
            let incarnation = elem.incarn + 1
            this.setValuePG(me.id, { collab: me, message: 2, incarn: incarnation })
            this.setValueCompteurPG(me.id)
          } else {
            if (this.PGHas(key)) {
              let overide = false
              if (this.getValueByKeyPG(key) === undefined) {
                overide = true
              } else if (
                this.getValueByKeyPG(key)!.message === 3 &&
                elem.incarn > this.getValueByKeyPG(key)!.incarn
              ) {
                overide = true
              } else if (
                (this.getValueByKeyPG(key)!.message === 1 || this.getValueByKeyPG(key)!.message === 2) &&
                elem.incarn >= this.getValueByKeyPG(key)!.incarn
              ) {
                overide = true
              }
              if (overide) {
                this.setValuePG(key, elem)
                this.setValueCompteurPG(key)
              }
            }
          }
          break
        case 4: // Confirm
          if (this.PGHas(key) && this.getValueByKeyPG(key)!.message !== 4) {
            if (key === me.id) {
              console.log("You've been declared dead")
              
              /*
              Procédure envisgeable pour rejoindre à nouveau le réseau :
              (- Attendre quelques périodes)
              - Envoyer un nouveau data-request
              - Reçevoir les données du réseau et vérifier si on a des informations à transmettre au groupe
              - Créer PG et compteur PG à partir des données du réseau (et ajouter nos entrées à transmettre si besoin)

              -> Pour l'instant, Joined ne permet pas d'override Confirm
              */
            }
            this.subjectCollabLeave.next(elem.collab)
            this.setValuePG(key, elem)
            this.setValueCompteurPG(key)
          }
          break
      }
    }
  }

  /**
   * Cloture les streams de Piggyback
   */
  completeSubject() {
    this.subjectCollabJoin.complete()
    this.subjectCollabUbdate.complete()
    this.subjectCollabLeave.complete()
  }


  /**
   * Retourne la liste des collaborateurs connectés
   */
  getListConnectedCollab() : number[] {
    let connectedCollab : number[] = []
    this.PG.forEach(element => {
      if(element.message !== 4) {
        connectedCollab.push(element.collab.id)  // Utilisation de muteCoreId plutôt que id ???
      }
    })
    return connectedCollab
  }

  /**
   * Retourne le collab qui a pour id mute-core celui qui est passé en paramètre
   * @param muteCoreId du collaborateur recherché
   */
  getCollaborator(muteCoreId: number): ICollaborator | undefined {
    for (const c of this.PG.values()) {
      if (c.collab.muteCoreId === muteCoreId) {
        return c.collab
      }
    }
    return undefined
  }

  /**
   * Retourne le nombre de collaborateurs connectés
   */
  nbCollab() {
    let nb = 0
    this.PG.forEach((x) => {
      if (x.message !== 4) {
        nb++
      }
    })
    return nb
  }

  /**
   * Retourne le nombre de fois qu'une information doit être transmise
   */
  calculNbRebond() {
    return Math.ceil(3 * Math.log2(this.nbCollab() + 1))
  }

  get remoteUpdate$(): Observable<ICollaborator> {
    return this.subjectCollabUbdate.asObservable()
  }

  get join$(): Observable<ICollaborator> {
    return this.subjectCollabJoin.asObservable()
  }

  get leave$(): Observable<ICollaborator> {
    return this.subjectCollabLeave.asObservable()
  }

  
}