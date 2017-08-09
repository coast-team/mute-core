import { LogootSDel, LogootSAdd } from 'mute-structs'
import { Observable, Subject, Subscription } from 'rxjs'

import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { State } from './State'

import { JoinEvent } from '../network/'

type Key = { id: number, clock: number }

export class SyncService {

  private id: number = -1
  private clock: number = 0
  private vector: Map<number, number> = new Map()
  private richLogootSOps: RichLogootSOperation[] = []

  private appliedOperationsSubject: Subject<Key>
  private isReadySubject: Subject<void>
  private localRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private querySyncSubject: Subject<Map<number, number>>
  private remoteLogootSOperationSubject: Subject<(LogootSAdd | LogootSDel)[]>
  private replySyncSubject: Subject<ReplySyncEvent>
  private stateSubject: Subject<State>
  private triggerQuerySyncSubject: Subject<void>


  private localLogootSOperationSubscription: Subscription
  private remoteQuerySyncSubscription: Subscription
  private remoteReplySyncSubscription: Subscription
  private remoteRichLogootSOperationSubscription: Subscription
  private storedStateSubscription: Subscription
  private triggerQuerySyncSubscription: Subscription

  constructor (id: number) {
    this.id = id
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

  get onLocalRichLogootSOperation (): Observable<RichLogootSOperation> {
    return this.localRichLogootSOperationSubject.asObservable()
  }

  get onQuerySync (): Observable<Map<number, number>> {
    return this.querySyncSubject.asObservable()
  }

  get onRemoteLogootSOperation (): Observable<(LogootSAdd | LogootSDel)[]> {
    return this.remoteLogootSOperationSubject.asObservable()
  }

  get onReplySync (): Observable<ReplySyncEvent> {
    return this.replySyncSubject.asObservable()
  }

  get onState (): Observable<State> {
    return this.stateSubject.asObservable()
  }

  get state (): State {
    return new State(this.vector, this.richLogootSOps)
  }

  set localLogootSOperationSource (source: Observable<LogootSAdd | LogootSDel>) {
    this.localLogootSOperationSubscription = source.subscribe((logootSOp: LogootSAdd | LogootSDel) => {
      const richLogootSOp: RichLogootSOperation = new RichLogootSOperation(this.id, this.clock, logootSOp)

      this.updateState(richLogootSOp)

      this.stateSubject.next(this.state)
      this.localRichLogootSOperationSubject.next(richLogootSOp)

      this.clock++
    })
  }

  set remoteQuerySyncSource (source: Observable<Map<number, number>>) {
    this.remoteQuerySyncSubscription = source.subscribe((vector: Map<number, number>) => {
        const missingRichLogootSOps: RichLogootSOperation[] = this.richLogootSOps.filter((richLogootSOperation: RichLogootSOperation) => {
        const id: number = richLogootSOperation.id
        const clock: number = richLogootSOperation.clock
        const v = vector.get(id)
        return v === undefined ? true : v < clock ? true : false
      })
      // TODO: Add sort function to apply LogootSAdd operations before LogootSDel ones

      const missingIntervals: Interval[] = []
      vector.forEach((clock: number, id: number) => {
        const v = this.vector.get(id)
        if (v === undefined) {
          const begin = 0
          const end: number = clock
          missingIntervals.push( new Interval(id, begin, end))
        } else if (v < clock) {
          const begin: number = v + 1
          const end: number = clock
          missingIntervals.push( new Interval(id, begin, end))
        }
      })

      const replySyncEvent: ReplySyncEvent = new ReplySyncEvent(missingRichLogootSOps, missingIntervals)
      this.replySyncSubject.next(replySyncEvent)
    })
  }

  set remoteReplySyncSource (source: Observable<ReplySyncEvent>) {
    this.remoteReplySyncSubscription = source.subscribe((replySyncEvent: ReplySyncEvent) => {
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
    this.remoteRichLogootSOperationSubscription = source.subscribe((richLogootSOp: RichLogootSOperation) => {
      this.applyRichLogootSOperations([richLogootSOp])
      this.stateSubject.next(this.state)
    })
  }

  private set storedStateSource (source: Observable<State>) {
    this.storedStateSubscription = source.subscribe((state: State) => {
      this.richLogootSOps = []
      this.vector.clear()
      this.applyRichLogootSOperations(state.richLogootSOps)
      this.isReadySubject.next()
    })
  }

  setJoinAndStateSources (joinSource: Observable<JoinEvent>, storedStateSource?: Observable<State>): void {
    let triggerQuerySyncObservable: Observable<JoinEvent> = joinSource
    if (storedStateSource) {
      this.storedStateSource = storedStateSource
      triggerQuerySyncObservable = joinSource.zip(
        this.isReadySubject,
        (joinEvent: JoinEvent) => {
          return joinEvent
        }
      )
    }
    triggerQuerySyncObservable
      .take(1)
      .subscribe((joinEvent: JoinEvent) => {
        if (!joinEvent.created) {
          console.log('SyncService: performing querySync at init')
          this.querySyncSubject.next(this.vector)
        }
      })
  }

  private initPeriodicQuerySync (): void {
    this.triggerQuerySyncSubscription = this.triggerQuerySyncSubject.subscribe(() => {
      console.log('SyncService: performing a periodic querySync')
      this.querySyncSubject.next(this.vector)
      this.triggerPeriodicQuerySync()
    })

    this.triggerPeriodicQuerySync()
  }

  private triggerPeriodicQuerySync (): void {
    const defaultTime = 10000
    const max = defaultTime / 2
    const min = - max
    const random = Math.floor(Math.random() * 2 * max) + min // Compute a random number between [0, 10000] then shift interval to [-5000, 5000]
    setTimeout(() => {
      this.triggerQuerySyncSubject.next()
    }, defaultTime + random)
  }

  clean (): void {
    this.appliedOperationsSubject.complete()
    this.isReadySubject.complete()
    this.localRichLogootSOperationSubject.complete()
    this.querySyncSubject.complete()
    this.remoteLogootSOperationSubject.complete()
    this.replySyncSubject.complete()
    this.stateSubject.complete()

    this.localLogootSOperationSubscription.unsubscribe()
    this.remoteQuerySyncSubscription.unsubscribe()
    this.remoteReplySyncSubscription.unsubscribe()
    this.remoteRichLogootSOperationSubscription.unsubscribe()
    if (this.storedStateSubscription !== undefined) {
      this.storedStateSubscription.unsubscribe()
    }
    this.triggerQuerySyncSubscription.unsubscribe()
  }

  private applyRichLogootSOperations (richLogootSOps: RichLogootSOperation[]): void {
    // Keep only new operations
    const newRichLogootSOps: RichLogootSOperation[] =
      richLogootSOps.filter((richLogootSOp: RichLogootSOperation) => {
        const id: number = richLogootSOp.id
        const clock: number = richLogootSOp.clock
        return !this.isAlreadyApplied(id, clock)
      })

    if (newRichLogootSOps.length > 0) {
      const logootSOperations: (LogootSAdd | LogootSDel)[] = []
      newRichLogootSOps
        .forEach((richLogootSOp) => {
          const id: number = richLogootSOp.id
          const clock: number = richLogootSOp.clock
          if (this.isAppliable(id, clock)) {
            this.updateState(richLogootSOp)
            logootSOperations.push(richLogootSOp.logootSOp)
            // Notify that the operation has been delivered
            this.appliedOperationsSubject.next({ id , clock })
          } else {
            // Deliver operation once the previous one will be applied
            console.log('SyncService: Buffering operation: ', { id, clock })
            this.appliedOperationsSubject
              .filter(({ id, clock}: Key) => {
                return richLogootSOp.id === id && richLogootSOp.clock === (clock + 1)
              })
              .take(1)
              .subscribe(() => {
                console.log('SyncService: Delivering operation: ', { id, clock })
                if (!this.isAlreadyApplied(id, clock)) {
                  this.applyRichLogootSOperations([richLogootSOp])
                }
              })
          }
        })

      this.remoteLogootSOperationSubject.next(logootSOperations)
    }
  }

  private updateState (richLogootSOp: RichLogootSOperation): void {
    console.assert(this.isAppliable(richLogootSOp.id, richLogootSOp.clock))
    this.vector.set(richLogootSOp.id, richLogootSOp.clock)
    this.richLogootSOps.push(richLogootSOp)
  }

  private isAlreadyApplied (id: number, clock: number): boolean {
    const v = this.vector.get(id)
    return v !== undefined && v >= clock
  }

  private isAppliable (id: number, clock: number): boolean {
    if (this.isAlreadyApplied(id, clock)) {
      return false
    }
    const v = this.vector.get(id)
    if (v === undefined) {
      return clock === 0
    }
    return clock === v + 1
  }

}
