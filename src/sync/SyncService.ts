import { Dot, IdentifierInterval, LogootSDel, LogootSOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { first } from 'rxjs/operators'

import { CollaboratorsService, ICollaborator } from '../collaborators'
import { Disposable } from '../misc'
import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { State } from './State'
import { StateVector } from './StateVector'

export class SyncService extends Disposable {
  private id: number
  private clock: number
  private richLogootSOps: RichLogootSOperation[]
  private vector: StateVector

  private appliedOperationsSubject: Subject<void>
  private localRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private querySyncSubject: Subject<StateVector>
  private remoteLogootSOperationSubject: Subject<{
    collaborator: ICollaborator | undefined
    operations: LogootSOperation[]
  }>
  private replySyncSubject: Subject<ReplySyncEvent>
  private collabsService: CollaboratorsService

  constructor(id: number, localState: State, collaboratorsService: CollaboratorsService) {
    super()
    this.id = id
    this.clock = 0
    this.collabsService = collaboratorsService
    this.vector = new StateVector()
    this.appliedOperationsSubject = new Subject()
    this.localRichLogootSOperationSubject = new Subject()
    this.querySyncSubject = new Subject()
    this.remoteLogootSOperationSubject = new Subject()
    this.replySyncSubject = new Subject()

    // Initialize local state
    this.richLogootSOps = []
    this.vector.clear()
    this.applyRichLogootSOperations(localState.richLogootSOps)
    // let applied
    // for (const op of localState.richLogootSOps.filter(
    //   ({ id, clock }) => !this.vector.isAlreadyDelivered(id, clock)
    // )) {
    //   if (this.isDeliverable(op)) {
    //     this.updateState(op)
    //     applied = true
    //   } else {
    //     this.bufferOperation(op)
    //   }
    // }
    // if (applied) {
    //   this.appliedOperationsSubject.next()
    // }
  }

  sync() {
    this.querySyncSubject.next(this.vector)
  }

  get onLocalRichLogootSOperation(): Observable<RichLogootSOperation> {
    return this.localRichLogootSOperationSubject.asObservable()
  }

  get onQuerySync(): Observable<StateVector> {
    return this.querySyncSubject.asObservable()
  }

  get onRemoteLogootSOperation(): Observable<{
    collaborator: ICollaborator | undefined
    operations: LogootSOperation[]
  }> {
    return this.remoteLogootSOperationSubject.asObservable()
  }

  get onReplySync(): Observable<ReplySyncEvent> {
    return this.replySyncSubject.asObservable()
  }

  get state(): State {
    return new State(this.vector.asMap(), this.richLogootSOps)
  }

  get getClock(): number {
    return this.clock
  }

  get getVector(): Map<number, number> {
    return this.vector.asMap()
  }

  set localLogootSOperationSource(source: Observable<LogootSOperation>) {
    this.newSub = source.subscribe((logootSOp) => {
      let dependencies: Dot[] = []
      if (logootSOp instanceof LogootSDel) {
        dependencies = this.getDependencies(logootSOp)
      }

      const richLogootSOp = new RichLogootSOperation(this.id, this.clock, logootSOp, dependencies)

      this.updateState(richLogootSOp)

      this.localRichLogootSOperationSubject.next(richLogootSOp)

      this.clock++
    })
  }

  set remoteQuerySyncSource(source: Observable<StateVector>) {
    this.newSub = source.subscribe((vector: StateVector) => {
      const missingRichLogootSOps: RichLogootSOperation[] = this.computeMissingOps(vector)
      // TODO: Add sort function to apply LogootSAdd operations before LogootSDel ones

      const missingIntervals: Interval[] = this.vector.computeMissingIntervals(vector)

      const replySyncEvent: ReplySyncEvent = new ReplySyncEvent(
        missingRichLogootSOps,
        missingIntervals
      )
      this.replySyncSubject.next(replySyncEvent)
    })
  }

  set remoteReplySyncSource(source: Observable<ReplySyncEvent>) {
    this.newSub = source.subscribe((replySyncEvent: ReplySyncEvent) => {
      if (replySyncEvent.richLogootSOps.length > 0) {
        this.applyRichLogootSOperations(replySyncEvent.richLogootSOps)
      }

      replySyncEvent.intervals.forEach(({ id: intervalId, begin, end }) => {
        this.richLogootSOps
          .filter(({ id, clock }) => intervalId === id && begin <= clock && clock <= end)
          .forEach((richLogootSOp) => this.localRichLogootSOperationSubject.next(richLogootSOp))
      })
    })
  }

  set remoteRichLogootSOperationSource(source: Observable<RichLogootSOperation>) {
    this.newSub = source.subscribe((richLogootSOp: RichLogootSOperation) => {
      this.applyRichLogootSOperations([richLogootSOp])
    })
  }

  computeMissingOps(vector: StateVector): RichLogootSOperation[] {
    return this.richLogootSOps.filter(({ id, clock }) => {
      const v = vector.get(id)
      return v === undefined ? true : v < clock ? true : false
    })
  }

  dispose(): void {
    this.appliedOperationsSubject.complete()
    this.localRichLogootSOperationSubject.complete()
    this.querySyncSubject.complete()
    this.remoteLogootSOperationSubject.complete()
    this.replySyncSubject.complete()
    super.dispose()
  }

  private applyRichLogootSOperations(richLogootSOps: RichLogootSOperation[]) {
    setTimeout(() => {
      // Keep only new operations
      const newRichLogootSOps = richLogootSOps.filter(
        ({ id, clock }) => !this.vector.isAlreadyDelivered(id, clock)
      )

      if (newRichLogootSOps.length > 0) {
        const logootSOperations: LogootSOperation[] = []
        newRichLogootSOps.forEach((richLogootSOp) => {
          if (this.isDeliverable(richLogootSOp)) {
            const logootSOp = richLogootSOp.logootSOp
            this.updateState(richLogootSOp)
            logootSOperations.push(logootSOp)
          } else {
            this.bufferOperation(richLogootSOp)
          }
        })

        if (logootSOperations.length > 0) {
          this.remoteLogootSOperationSubject.next({
            collaborator: this.collabsService.getCollaborator(newRichLogootSOps[0].id),
            operations: logootSOperations,
          })
          this.appliedOperationsSubject.next()
        }
      }
    })
  }

  private bufferOperation(richLogootSOp: RichLogootSOperation): void {
    // Will deliver operation once the previous one was applied
    this.appliedOperationsSubject
      .pipe(first(() => this.isDeliverable(richLogootSOp)))
      .subscribe(() => {
        if (!this.vector.isAlreadyDelivered(richLogootSOp.id, richLogootSOp.clock)) {
          this.applyRichLogootSOperations([richLogootSOp])
        }
      })
  }

  private updateState(richLogootSOp: RichLogootSOperation): void {
    console.assert(this.isDeliverable(richLogootSOp))
    const id: number = richLogootSOp.id
    const clock: number = richLogootSOp.clock
    this.vector.set(id, clock)
    this.richLogootSOps.push(richLogootSOp)
  }

  private isDeliverable({ id, clock, dependencies }: RichLogootSOperation) {
    return this.vector.isDeliverable(id, clock) && this.hasDeliveredDependencies(dependencies)
  }

  private hasDeliveredDependencies(dependencies: Dot[]): boolean {
    return dependencies.every((dot) => {
      const currentClock = this.vector.get(dot.replicaNumber)
      return currentClock !== undefined && dot.clock <= currentClock
    })
  }

  private getDependencies(logootSDel: LogootSDel): Dot[] {
    return logootSDel.lid.map((idInterval: IdentifierInterval) => {
      const replicaNumber = idInterval.idBegin.replicaNumber
      const clock = this.vector.get(replicaNumber)

      // FIXME: should not use 'as Dot'
      return { replicaNumber, clock } as Dot
    })
  }
}
