import { LogootSOperation } from 'mute-structs'
import { Observable } from 'rxjs/Observable'
import { filter, take, takeUntil, zip } from 'rxjs/operators'
import { Subject } from 'rxjs/Subject'

import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { State } from './State'
import { StateVector } from './StateVector'

import { Disposable } from '../Disposable'
import { JoinEvent } from '../network/'

export class SyncService implements Disposable {

  private id: number = -1
  private clock: number = 0
  private richLogootSOps: RichLogootSOperation[] = []
  private vector: StateVector

  private appliedOperationsSubject: Subject<void>
  private disposeSubject: Subject<void>
  private isReadySubject: Subject<void>
  private localRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private querySyncSubject: Subject<StateVector>
  private remoteLogootSOperationSubject: Subject<LogootSOperation[]>
  private replySyncSubject: Subject<ReplySyncEvent>
  private stateSubject: Subject<State>
  private triggerQuerySyncSubject: Subject<void>

  constructor (id: number) {
    this.id = id
    this.vector = new StateVector()
    this.appliedOperationsSubject = new Subject()
    this.disposeSubject = new Subject<void>()
    this.isReadySubject = new Subject<void>()
    this.localRichLogootSOperationSubject = new Subject()
    this.querySyncSubject = new Subject()
    this.remoteLogootSOperationSubject = new Subject()
    this.replySyncSubject = new Subject()
    this.stateSubject = new Subject()
    this.triggerQuerySyncSubject = new Subject<void>()

    this.initPeriodicQuerySync()
  }

  get onLocalRichLogootSOperation (): Observable<RichLogootSOperation> {
    return this.localRichLogootSOperationSubject.asObservable()
  }

  get onQuerySync (): Observable<StateVector> {
    return this.querySyncSubject.asObservable()
  }

  get onRemoteLogootSOperation (): Observable<LogootSOperation[]> {
    return this.remoteLogootSOperationSubject.asObservable()
  }

  get onReplySync (): Observable<ReplySyncEvent> {
    return this.replySyncSubject.asObservable()
  }

  get onState (): Observable<State> {
    return this.stateSubject.asObservable()
  }

  get state (): State {
    return new State(this.vector.asMap(), this.richLogootSOps)
  }

  set localLogootSOperationSource (source: Observable<LogootSOperation>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((logootSOp: LogootSOperation) => {
        const richLogootSOp: RichLogootSOperation =
          new RichLogootSOperation(this.id, this.clock, logootSOp)

        this.updateState(richLogootSOp)

        this.stateSubject.next(this.state)
        this.localRichLogootSOperationSubject.next(richLogootSOp)

        this.clock++
      })
  }

  set remoteQuerySyncSource (source: Observable<StateVector>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((vector: StateVector) => {
        const missingRichLogootSOps: RichLogootSOperation[] =
          this.computeMissingOps(vector)
        // TODO: Add sort function to apply LogootSAdd operations before LogootSDel ones

        const missingIntervals: Interval[] =
          this.vector.computeMissingIntervals(vector)

        const replySyncEvent: ReplySyncEvent =
          new ReplySyncEvent(missingRichLogootSOps, missingIntervals)
        this.replySyncSubject.next(replySyncEvent)
      })
  }

  set remoteReplySyncSource (source: Observable<ReplySyncEvent>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((replySyncEvent: ReplySyncEvent) => {
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

  set remoteRichLogootSOperationSource (source: Observable<RichLogootSOperation>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((richLogootSOp: RichLogootSOperation) => {
        this.applyRichLogootSOperations([richLogootSOp])
        this.stateSubject.next(this.state)
      })
  }

  setJoinAndStateSources (joinSource: Observable<JoinEvent>, storedStateSource?: Observable<State>): void {
    let triggerQuerySyncObservable: Observable<JoinEvent> = joinSource
    if (storedStateSource) {
      this.storedStateSource = storedStateSource
      triggerQuerySyncObservable = joinSource.pipe(
        takeUntil(this.disposeSubject),
        zip(this.isReadySubject, (joinEvent) => joinEvent),
      )
    }
    triggerQuerySyncObservable.pipe(take(1))
      .subscribe((joinEvent: JoinEvent) => {
        if (!joinEvent.created) {
          this.querySyncSubject.next(this.vector)
        }
      })
  }

  computeMissingOps (vector: StateVector): RichLogootSOperation[] {
    return this.richLogootSOps
      .filter((richLogootSOperation: RichLogootSOperation) => {
        const id: number = richLogootSOperation.id
        const clock: number = richLogootSOperation.clock
        const v = vector.get(id)
        return v === undefined ? true : v < clock ? true : false
      })
  }

  dispose (): void {
    this.appliedOperationsSubject.complete()
    this.disposeSubject.next()
    this.disposeSubject.complete()
    this.isReadySubject.complete()
    this.localRichLogootSOperationSubject.complete()
    this.querySyncSubject.complete()
    this.remoteLogootSOperationSubject.complete()
    this.replySyncSubject.complete()
    this.stateSubject.complete()
  }

  private set storedStateSource (source: Observable<State>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((state: State) => {
        this.richLogootSOps = []
        this.vector.clear()
        this.applyRichLogootSOperations(state.richLogootSOps)
        this.isReadySubject.next()
      })
  }

  private initPeriodicQuerySync (): void {
    this.triggerQuerySyncSubject.pipe(takeUntil(this.disposeSubject))
      .subscribe(() => {
        this.querySyncSubject.next(this.vector)
        this.triggerPeriodicQuerySync()
      })

    this.triggerPeriodicQuerySync()
  }

  private triggerPeriodicQuerySync (): void {
    const defaultTime = 10000
    const max = defaultTime / 2
    const min = - max
    // Compute a random number between [0, 10000] then shift interval to [-5000, 5000]
    const random = Math.floor(Math.random() * 2 * max) + min
    setTimeout(() => {
      this.triggerQuerySyncSubject.next()
    }, defaultTime + random)
  }

  private applyRichLogootSOperations (richLogootSOps: RichLogootSOperation[]): void {
    // Keep only new operations
    const newRichLogootSOps: RichLogootSOperation[] =
      richLogootSOps.filter((richLogootSOp: RichLogootSOperation) => {
        const id: number = richLogootSOp.id
        const clock: number = richLogootSOp.clock
        return !this.vector.isAlreadyDelivered(id, clock)
      })

    if (newRichLogootSOps.length > 0) {
      const logootSOperations: LogootSOperation[] = []
      newRichLogootSOps
        .forEach((richLogootSOp) => {
          const id: number = richLogootSOp.id
          const clock: number = richLogootSOp.clock
          if (this.vector.isDeliverable(id, clock)) {
            this.updateState(richLogootSOp)
            logootSOperations.push(richLogootSOp.logootSOp)
          } else {
            this.bufferOperation(richLogootSOp)
          }
        })

      if (logootSOperations.length > 0) {
        this.remoteLogootSOperationSubject.next(logootSOperations)
        this.appliedOperationsSubject.next()
      }
    }
  }

  private bufferOperation (richLogootSOp: RichLogootSOperation): void {
    // Will deliver operation once the previous one will be applied
    const id: number = richLogootSOp.id
    const clock: number = richLogootSOp.clock
    console.log('SyncService: Buffering operation: ', { id, clock })
    const stopSubject: Subject<void> = new Subject()
    this.appliedOperationsSubject.pipe(
      takeUntil(stopSubject),
      filter(() => {
        const currentClock = this.vector.get(id)
        return currentClock !== undefined && currentClock + 1 === clock
      }),
    ).subscribe(() => {
      stopSubject.next()
      stopSubject.complete()
      console.log('SyncService: Delivering operation: ', { id, clock })
      if (!this.vector.isAlreadyDelivered(id, clock)) {
        this.applyRichLogootSOperations([richLogootSOp])
      }
    })
  }

  private updateState (richLogootSOp: RichLogootSOperation): void {
    console.assert(this.vector.isDeliverable(richLogootSOp.id, richLogootSOp.clock))
    this.vector.set(richLogootSOp.id, richLogootSOp.clock)
    this.richLogootSOps.push(richLogootSOp)
  }
}
