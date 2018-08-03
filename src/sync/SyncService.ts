import { Dot, IdentifierInterval, LogootSDel, LogootSOperation } from 'mute-structs'
import { Observable, Subject, zip } from 'rxjs'
import { filter, take, takeUntil } from 'rxjs/operators'

import { CollaboratorsService, ICollaborator } from '../collaborators'
import { Disposable } from '../Disposable'
import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { State } from './State'
import { StateVector } from './StateVector'

export class SyncService extends Disposable {
  private id: number = -1
  private clock: number = 0
  private richLogootSOps: RichLogootSOperation[] = []
  private vector: StateVector

  private appliedOperationsSubject: Subject<void>
  private isReadySubject: Subject<void>
  private localRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private querySyncSubject: Subject<StateVector>
  private remoteLogootSOperationSubject: Subject<{
    collaborator: ICollaborator | undefined
    operations: LogootSOperation[]
  }>
  private replySyncSubject: Subject<ReplySyncEvent>
  private stateSubject: Subject<State>
  private triggerQuerySyncSubject: Subject<void>
  private collabsService: CollaboratorsService

  constructor(id: number, collaboratorsService: CollaboratorsService) {
    super()
    this.id = id
    this.collabsService = collaboratorsService
    this.vector = new StateVector()
    this.appliedOperationsSubject = new Subject()
    this.isReadySubject = new Subject<void>()
    this.localRichLogootSOperationSubject = new Subject()
    this.querySyncSubject = new Subject()
    this.remoteLogootSOperationSubject = new Subject()
    this.replySyncSubject = new Subject()
    this.stateSubject = new Subject()
    this.triggerQuerySyncSubject = new Subject<void>()

    this.initPeriodicQuerySync()
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

  get onState(): Observable<State> {
    return this.stateSubject.asObservable()
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
    this.newSub = source.subscribe((logootSOp: LogootSOperation) => {
      let dependencies: Dot[] = []
      if (logootSOp instanceof LogootSDel) {
        dependencies = this.getDependencies(logootSOp)
      }

      const richLogootSOp = new RichLogootSOperation(this.id, this.clock, logootSOp, dependencies)

      this.updateState(richLogootSOp)

      this.stateSubject.next(this.state)
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
        this.stateSubject.next(this.state)
      }

      replySyncEvent.intervals.forEach((interval: Interval) => {
        this.richLogootSOps
          .filter((richLogootSOp: RichLogootSOperation) => {
            const id: number = richLogootSOp.id
            const clock: number = richLogootSOp.clock
            return interval.id === id && interval.begin <= clock && clock <= interval.end
          })
          .forEach((richLogootSOp: RichLogootSOperation) => {
            this.localRichLogootSOperationSubject.next(richLogootSOp)
          })
      })
    })
  }

  set remoteRichLogootSOperationSource(source: Observable<RichLogootSOperation>) {
    this.newSub = source.subscribe((richLogootSOp: RichLogootSOperation) => {
      this.applyRichLogootSOperations([richLogootSOp])
      this.stateSubject.next(this.state)
    })
  }

  setJoinAndStateSources(
    joinSource: Observable<any>,
    metadataSource: Observable<void>,
    storedStateSource: Observable<State>
  ): void {
    this.storedStateSource = storedStateSource
    zip(this.isReadySubject, metadataSource, joinSource)
      .pipe(take(1))
      .subscribe(() => {
        if (this.collabsService.collaborators.size > 1) {
          this.querySyncSubject.next(this.vector)
        }
      })
  }

  computeMissingOps(vector: StateVector): RichLogootSOperation[] {
    return this.richLogootSOps.filter((richLogootSOperation: RichLogootSOperation) => {
      const id: number = richLogootSOperation.id
      const clock: number = richLogootSOperation.clock
      const v = vector.get(id)
      return v === undefined ? true : v < clock ? true : false
    })
  }

  dispose(): void {
    this.appliedOperationsSubject.complete()
    this.isReadySubject.complete()
    this.localRichLogootSOperationSubject.complete()
    this.querySyncSubject.complete()
    this.remoteLogootSOperationSubject.complete()
    this.replySyncSubject.complete()
    this.stateSubject.complete()
    super.dispose()
  }

  private set storedStateSource(source: Observable<State>) {
    this.newSub = source.subscribe((state: State) => {
      this.richLogootSOps = []
      this.vector.clear()
      this.applyRichLogootSOperations(state.richLogootSOps)
      this.isReadySubject.next()
    })
  }

  private initPeriodicQuerySync(): void {
    this.newSub = this.triggerQuerySyncSubject.subscribe(() => {
      this.querySyncSubject.next(this.vector)
      this.triggerPeriodicQuerySync()
    })

    this.triggerPeriodicQuerySync()
  }

  private triggerPeriodicQuerySync(): void {
    const defaultTime = 10000
    const max = defaultTime / 2
    const min = -max
    // Compute a random number between [0, 10000] then shift interval to [-5000, 5000]
    const random = Math.floor(Math.random() * 2 * max) + min
    setTimeout(() => {
      this.triggerQuerySyncSubject.next()
    }, defaultTime + random)
  }

  private applyRichLogootSOperations(richLogootSOps: RichLogootSOperation[]): void {
    // Keep only new operations
    const newRichLogootSOps: RichLogootSOperation[] = richLogootSOps.filter(
      (richLogootSOp: RichLogootSOperation) => {
        const id = richLogootSOp.id
        const clock = richLogootSOp.clock
        return !this.vector.isAlreadyDelivered(id, clock)
      }
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
  }

  private bufferOperation(richLogootSOp: RichLogootSOperation): void {
    // Will deliver operation once the previous one will be applied
    const id: number = richLogootSOp.id
    const clock: number = richLogootSOp.clock
    const stopSubject: Subject<void> = new Subject()
    this.appliedOperationsSubject
      .pipe(takeUntil(stopSubject), filter(() => this.isDeliverable(richLogootSOp)))
      .subscribe(() => {
        stopSubject.next()
        stopSubject.complete()
        if (!this.vector.isAlreadyDelivered(id, clock)) {
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

  private isDeliverable(richLogootSOp: RichLogootSOperation) {
    const id: number = richLogootSOp.id
    const clock: number = richLogootSOp.clock
    const dependencies: Dot[] = richLogootSOp.dependencies
    return this.vector.isDeliverable(id, clock) && this.hasDeliveredDependencies(dependencies)
  }

  private hasDeliveredDependencies(dependencies: Dot[]): boolean {
    return dependencies.every((dot: Dot) => {
      const currentClock: number | undefined = this.vector.get(dot.replicaNumber)
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
