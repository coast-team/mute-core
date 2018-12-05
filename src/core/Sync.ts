import { Observable, Subject } from 'rxjs'
import { first } from 'rxjs/operators'
import { CollaboratorsService, ICollaborator } from '../collaborators'
import { Disposable } from '../misc'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichOperation } from './RichOperation'
import { StateVector } from './StateVector'

export interface SyncState<Op> {
  networkClock: number
  vector: Map<number, number>
  richOperations: Array<RichOperation<Op>>
}

export abstract class Sync<Op> extends Disposable {
  protected id: number
  protected clock: number
  protected richOperations: Array<RichOperation<Op>>
  protected vector: StateVector

  protected querySyncSubject: Subject<StateVector>
  protected replySyncSubject: Subject<ReplySyncEvent<Op>>

  protected appliedOperationsSubject: Subject<void>
  protected localRichOperationsSubject: Subject<RichOperation<Op>>
  protected remoteOperationsSubject: Subject<{
    collaborator: ICollaborator | undefined
    operations: Op[]
  }>
  protected logsRemoteRichOperationsSubject: Subject<{
    clock: number
    author: number
    operation: Op
  }>

  protected collabsService: CollaboratorsService

  constructor(
    id: number,
    networkClock: number,
    vector: Map<number, number>,
    rOps: Array<RichOperation<Op>>,
    collaboratorsService: CollaboratorsService
  ) {
    super()

    this.id = id
    this.clock = 0
    this.vector = new StateVector()

    this.querySyncSubject = new Subject()
    this.replySyncSubject = new Subject()

    this.collabsService = collaboratorsService

    this.appliedOperationsSubject = new Subject()
    this.localRichOperationsSubject = new Subject()
    this.remoteOperationsSubject = new Subject()

    this.logsRemoteRichOperationsSubject = new Subject()

    // Initialize local state
    this.richOperations = rOps
    this.vector = new StateVector(vector)
    this.clock = networkClock
  }

  sync() {
    this.querySyncSubject.next(this.vector)
  }

  get querySync$(): Observable<StateVector> {
    return this.querySyncSubject.asObservable()
  }

  get replySync$(): Observable<ReplySyncEvent<Op>> {
    return this.replySyncSubject.asObservable()
  }

  get localRichOperations$(): Observable<RichOperation<Op>> {
    return this.localRichOperationsSubject.asObservable()
  }

  get remoteOperations$(): Observable<{
    collaborator: ICollaborator | undefined
    operations: Op[]
  }> {
    return this.remoteOperationsSubject.asObservable()
  }

  get logsRemoteRichOperations$(): Observable<{
    clock: number
    author: number
    operation: Op
  }> {
    return this.logsRemoteRichOperationsSubject.asObservable()
  }

  get stateElements(): SyncState<Op> {
    return {
      networkClock: this.clock,
      vector: this.vector.asMap(),
      richOperations: this.richOperations,
    }
  }

  set remoteQuerySync$(source: Observable<StateVector>) {
    this.newSub = source.subscribe((vector) => {
      const missingRichOps = this.computeMissingOps(vector)

      const missingIntervals = this.vector.computeMissingIntervals(vector)

      this.replySyncSubject.next(new ReplySyncEvent(missingRichOps, missingIntervals))
    })
  }

  set remoteReplySync$(source: Observable<ReplySyncEvent<Op>>) {
    this.newSub = source.subscribe(({ richOps, intervals }) => {
      if (richOps.length > 0) {
        this.applyRichOperations(richOps)
      }

      intervals.forEach(({ id: intervalId, begin, end }) => {
        this.richOperations
          .filter(({ id, clock }) => intervalId === id && begin <= clock && clock <= end)
          .forEach((richOp) => this.localRichOperationsSubject.next(richOp))
      })
    })
  }

  set localOperations$(source: Observable<Op>) {
    this.newSub = source.subscribe((operation) => {
      const dependencies = this.computeDependencies(operation)
      const richOp = new RichOperation<Op>(this.id, this.clock, operation, dependencies)

      this.updateState(richOp)
      this.localRichOperationsSubject.next(richOp)
      this.clock++
    })
  }

  set remoteRichOperations$(source: Observable<RichOperation<Op>>) {
    this.newSub = source.subscribe((op) => this.applyRichOperations([op]))
  }

  computeMissingOps(vector: StateVector): Array<RichOperation<Op>> {
    return this.richOperations.filter(({ id, clock }) => {
      const v = vector.get(id)
      return v === undefined || v < clock
    })
  }

  dispose() {
    this.querySyncSubject.complete()
    this.replySyncSubject.complete()
    this.appliedOperationsSubject.complete()
    this.localRichOperationsSubject.complete()
    this.remoteOperationsSubject.complete()
    this.logsRemoteRichOperationsSubject.complete()
    super.dispose()
  }

  abstract computeDependencies(operation: Op): Map<number, number>

  private applyRichOperations(richOps: Array<RichOperation<Op>>) {
    setTimeout(() => {
      // Keep only new operations
      const newRichOps = richOps.filter(
        ({ id, clock }) => !this.vector.isAlreadyDelivered(id, clock)
      )

      if (newRichOps.length > 0) {
        const operations: Op[] = []
        newRichOps.forEach((op) => {
          if (this.isDeliverable(op)) {
            const operation = op.operation
            this.updateState(op)
            operations.push(operation)
            this.logsRemoteRichOperationsSubject.next({
              clock: op.clock,
              author: op.id,
              operation: op.operation,
            })
          } else {
            this.bufferOperation(op)
          }
        })
        if (operations.length > 0) {
          this.remoteOperationsSubject.next({
            collaborator: this.collabsService.getCollaborator(newRichOps[0].id),
            operations,
          })
          this.appliedOperationsSubject.next()
        }
      }
    })
  }

  private bufferOperation(richOp: RichOperation<Op>) {
    // Will deliver operation once the previous one was applied
    this.appliedOperationsSubject.pipe(first(() => this.isDeliverable(richOp))).subscribe(() => {
      if (!this.vector.isAlreadyDelivered(richOp.id, richOp.clock)) {
        this.applyRichOperations([richOp])
      }
    })
  }

  private updateState(richOp: RichOperation<Op>) {
    console.assert(this.isDeliverable(richOp))
    const { id, clock } = richOp
    this.vector.set(id, clock)
    this.richOperations.push(richOp)
  }

  private isDeliverable({ id, clock, dependencies }: RichOperation<Op>) {
    return this.vector.isDeliverable(id, clock) && this.hasDeliveredDependencies(dependencies)
  }

  private hasDeliveredDependencies(dependencies: Map<number, number>): boolean {
    let result = true
    dependencies.forEach((clock, replicaNumber) => {
      const currentClock = this.vector.get(replicaNumber)
      if (currentClock === undefined || clock > currentClock) {
        result = false
      }
    })
    return result
  }
}
