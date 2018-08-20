import { Dot, LogootSDel, LogootSOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { first } from 'rxjs/operators'

import { CollaboratorsService, ICollaborator } from '../collaborators'
import { Disposable } from '../misc'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { State } from './State'
import { StateVector } from './StateVector'

export class Sync extends Disposable {
  private id: number
  private clock: number
  private richLogootSOps: RichLogootSOperation[]
  private vector: StateVector

  private appliedOperationsSubject: Subject<void>
  private localRichLogootSOperationsSubject: Subject<RichLogootSOperation>
  private querySyncSubject: Subject<StateVector>
  private remoteLogootSOperationsSubject: Subject<{
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
    this.localRichLogootSOperationsSubject = new Subject()
    this.querySyncSubject = new Subject()
    this.remoteLogootSOperationsSubject = new Subject()
    this.replySyncSubject = new Subject()

    // Initialize local state
    this.richLogootSOps = []
    this.vector.clear()
    this.applyRichLogootSOperations(localState.richLogootSOps)
  }

  sync() {
    this.querySyncSubject.next(this.vector)
  }

  get localRichLogootSOperations(): Observable<RichLogootSOperation> {
    return this.localRichLogootSOperationsSubject.asObservable()
  }

  get querySync$(): Observable<StateVector> {
    return this.querySyncSubject.asObservable()
  }

  get remoteLogootSOperations$(): Observable<{
    collaborator: ICollaborator | undefined
    operations: LogootSOperation[]
  }> {
    return this.remoteLogootSOperationsSubject.asObservable()
  }

  get replySync$(): Observable<ReplySyncEvent> {
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

  set localLogootSOperations$(source: Observable<LogootSOperation>) {
    this.newSub = source.subscribe((logootSOp) => {
      const dependencies = logootSOp instanceof LogootSDel ? this.getDependencies(logootSOp) : []
      const richLogootSOp = new RichLogootSOperation(this.id, this.clock, logootSOp, dependencies)

      this.updateState(richLogootSOp)
      this.localRichLogootSOperationsSubject.next(richLogootSOp)
      this.clock++
    })
  }

  set remoteQuerySync$(source: Observable<StateVector>) {
    this.newSub = source.subscribe((vector) => {
      const missingRichLogootSOps = this.computeMissingOps(vector)
      // TODO: Add sort function to apply LogootSAdd operations before LogootSDel ones
      const missingIntervals = this.vector.computeMissingIntervals(vector)

      this.replySyncSubject.next(new ReplySyncEvent(missingRichLogootSOps, missingIntervals))
    })
  }

  set remoteReplySync$(source: Observable<ReplySyncEvent>) {
    this.newSub = source.subscribe(({ richLogootSOps, intervals }) => {
      if (richLogootSOps.length > 0) {
        this.applyRichLogootSOperations(richLogootSOps)
      }

      intervals.forEach(({ id: intervalId, begin, end }) => {
        this.richLogootSOps
          .filter(({ id, clock }) => intervalId === id && begin <= clock && clock <= end)
          .forEach((richLogootSOp) => this.localRichLogootSOperationsSubject.next(richLogootSOp))
      })
    })
  }

  set remoteRichLogootSOperations$(source: Observable<RichLogootSOperation>) {
    this.newSub = source.subscribe((op) => this.applyRichLogootSOperations([op]))
  }

  computeMissingOps(vector: StateVector): RichLogootSOperation[] {
    return this.richLogootSOps.filter(({ id, clock }) => {
      const v = vector.get(id)
      return v === undefined || v < clock
    })
  }

  dispose() {
    this.appliedOperationsSubject.complete()
    this.localRichLogootSOperationsSubject.complete()
    this.querySyncSubject.complete()
    this.remoteLogootSOperationsSubject.complete()
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
        newRichLogootSOps.forEach((op) => {
          if (this.isDeliverable(op)) {
            const logootSOp = op.logootSOp
            this.updateState(op)
            logootSOperations.push(logootSOp)
          } else {
            this.bufferOperation(op)
          }
        })
        if (logootSOperations.length > 0) {
          this.remoteLogootSOperationsSubject.next({
            collaborator: this.collabsService.getCollaborator(newRichLogootSOps[0].id),
            operations: logootSOperations,
          })
          this.appliedOperationsSubject.next()
        }
      }
    })
  }

  private bufferOperation(richLogootSOp: RichLogootSOperation) {
    // Will deliver operation once the previous one was applied
    this.appliedOperationsSubject
      .pipe(first(() => this.isDeliverable(richLogootSOp)))
      .subscribe(() => {
        if (!this.vector.isAlreadyDelivered(richLogootSOp.id, richLogootSOp.clock)) {
          this.applyRichLogootSOperations([richLogootSOp])
        }
      })
  }

  private updateState(richLogootSOp: RichLogootSOperation) {
    console.assert(this.isDeliverable(richLogootSOp))
    const { id, clock } = richLogootSOp
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

  private getDependencies({ lid }: LogootSDel): Dot[] {
    // FIXME: should not use 'as Dot'
    return lid.map(
      ({ idBegin: { replicaNumber } }) =>
        ({ replicaNumber, clock: this.vector.get(replicaNumber) } as Dot)
    )
  }
}
