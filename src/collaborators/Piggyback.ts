import { Observable, Subject } from 'rxjs'
import { 
    ISwimPG,
    ICollaborator,
    EnumNumPG
} from './ICollaborator'


export class Piggyback {
    private PG : Map<number, ISwimPG>  // Map qui associe à l'id d'un collaborateur son état (1: Joined, 2: Alive, 3: Suspect, 4: Confirm)
    private compteurPG : Map<number, number> // Map qui associe à l'id d'un collaborateur le nombre de fois pù la modification de son état doit être ajouté au PG

    private incarnation: number  // Numéro d'incarnation permettant de "dater" les messages

    private subjectCollabJoin: Subject<ICollaborator>  // Permet d'être informé lorsqu'un Collaborator rejoint 
    private subjectCollabUbdate: Subject<ICollaborator>  // Permet d'être informé lorsqu'un Collaborator met à jour ses infos 
    private subjectCollabLeave: Subject<ICollaborator>  // Permet de tenir informé CollabService qu'un Collaborator a quitté

    constructor() {
        this.PG = new Map<number, ISwimPG>()
        this.compteurPG = new Map<number, number>()

        this.incarnation = 0

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
    getPG() : Map<number, ISwimPG> {
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
    PGHas(idCollab: number) : boolean {
        return this.PG.has(idCollab)
    }

    /**
     * Retourne l'état du collaborateur (ou undefined si la clé n'existe pas)
     * @param key id d'un collaborateur
     */
    getValueByKeyPG(key: number) : ISwimPG | undefined {
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
    getCompteurPG() : Map<number, number> {
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
     * Retourne le numéro d'incarnation
     */
    getIncarnation() : number {
      return this.incarnation
    }

    /**
     * Augmente de 1 le numéro d'incarnation
     */
    increaseIncarnation() {
      this.incarnation++
    }

   /**
    * Retourne un PG avec les infos qui doivent être transmises
    */
   createToPG() : Map<number, ISwimPG> {
    const toPG: Map<number, ISwimPG> = new Map<number, ISwimPG>()
    for (const [key, value] of this.PG) {
      if (this.compteurPG.get(key)! > 0) {
        this.compteurPG.set(key, this.compteurPG.get(key)! - 1)
        toPG.set(key, value)
      } else if (this.PG.get(key)!.message === EnumNumPG.Suspect) {
        toPG.set(key, value)
      }
    }
    return toPG
  }


  handlePG(piggyback: Map<number, ISwimPG>, me: ICollaborator) {
    for (const [key, elem] of piggyback) {
      // Evaluate PG message
      switch (elem.message) {
        case EnumNumPG.Alive: // ALIVE
          if(this.PGHas(key)) {
            let current = this.getValueByKeyPG(key)
            if(elem.incarn >= current!.incarn) {
              if(!this.collabEquals(current!.collab, elem.collab)) {
                this.subjectCollabUbdate.next(elem.collab)
              }
              this.setValuePG(key, elem)
              this.setValueCompteurPG(key)
            }
          } else {
            this.subjectCollabJoin.next(elem.collab)
            this.setValuePG(key, elem)
            this.setValueCompteurPG(key)
          }
          break

        case EnumNumPG.Suspect: // SUSPECT
          if (key === me.id) {
            this.increaseIncarnation()
            this.setValuePG(me.id, { collab: me, message: EnumNumPG.Alive, incarn: this.incarnation })
            this.setValueCompteurPG(me.id)
          } else {
            if (this.PGHas(key)) {
              let overide = false
              let current = this.getValueByKeyPG(key)
              /*if (this.getValueByKeyPG(key) === undefined) {
                overide = true
              } else*/
              if (current!.message === EnumNumPG.Suspect && elem.incarn > current!.incarn) {
                overide = true
              } else if (current!.message === EnumNumPG.Alive && elem.incarn >= current!.incarn) {
                overide = true
              }
              if(!this.collabEquals(elem.collab, current!.collab)) {
                this.subjectCollabUbdate.next(elem.collab)
              }
              if (overide) {
                this.setValuePG(key, elem)
                this.setValueCompteurPG(key)
              }
            } else {
              this.subjectCollabJoin.next(elem.collab)
              this.setValuePG(key, elem)
              this.setValueCompteurPG(key)
            }
          }
          break

        case EnumNumPG.Dead: // DEAD
          if (this.PGHas(key) && this.getValueByKeyPG(key)!.message !== EnumNumPG.Dead) {
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
   * Mets à jour les infos d'un collaborateur sur l'interface
   * @param key id du collaborateur
   * @param elem état du colaborateur
   */
  /*majInfoCollaborator(key: number, elem: ISwimPG) {
    if (this.PGHas(key)) {
      if(elem.incarn >= this.getValueByKeyPG(key)!.incarn) {
        const PGEntry = this.getValueByKeyPG(key)!
        if (!this.collabEquals(PGEntry.collab, elem.collab)) {
          PGEntry.collab = elem.collab
        }
        PGEntry.incarn = elem.incarn
        this.setValuePG(key, PGEntry)
        this.subjectCollabUbdate.next(PGEntry.collab)
      }
    } else {
      this.setValuePG(key, elem)
      this.setValueCompteurPG(key)
      this.subjectCollabJoin.next(elem.collab)
    }
  }*/


  /**
   * Retourne true si les deux Collaborator en paramètres sont identiques
   * @param collab1 ICollaborateur
   * @param collab2 ICollaborateur
   */
  collabEquals(collab1: ICollaborator, collab2: ICollaborator) {
    return collab1.id === collab2.id && 
      collab1.muteCoreId === collab2.muteCoreId &&
      collab1.displayName === collab2.displayName &&
      collab1.login === collab2.login &&
      collab1.email === collab2.email &&
      collab1.avatar === collab2.avatar &&
      collab1.deviceID === collab2.deviceID
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
      if(element.message !== EnumNumPG.Dead) {
        connectedCollab.push(element.collab.id)  // Utilisation de muteCoreId plutôt que id ???
      }
    })
    return connectedCollab
  }

  /**
   * Déclare un Collaborateur dead
   * @param numCollab id du Collaborateur dead
   */
  collabLeave(numCollab : number) {
    const etat = this.getValueByKeyPG(numCollab)
    if(etat) {
      this.subjectCollabLeave.next(etat.collab)
      this.setValuePG(numCollab, {
        collab: etat.collab,
        message: EnumNumPG.Dead,
        incarn: etat.incarn,
      })
    this.setValueCompteurPG(numCollab)
    }
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
  nbCollab() : number {
    let nb = 0
    this.PG.forEach((x) => {
      if (x.message !== EnumNumPG.Dead) {
        nb++
      }
    })
    return nb
  }

  /**
   * Retourne le nombre de fois qu'une information doit être transmise
   */
  calculNbRebond() : number {
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