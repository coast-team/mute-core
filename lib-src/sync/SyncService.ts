import { LogootSDel, LogootSAdd } from 'mute-structs'
import { Observable, Subject, Subscription } from 'rxjs'

import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { State } from './State'

import { JoinEvent } from '../network/'

export class SyncService {

  private id: number = -1
  private isSync: boolean = false
  private clock: number = 0
  private vector: Map<number, number> = new Map()
  private richLogootSOps: RichLogootSOperation[] = []

  private isReadySubject: Subject<void>
  private isSyncSubject: Subject<void>
  private localRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private querySyncSubject: Subject<Map<number, number>>
  private remoteLogootSOperationSubject: Subject<(LogootSAdd | LogootSDel)[]>
  private remoteQuerySyncSubject: Subject<Map<number, number>>
  private remoteRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private replySyncSubject: Subject<ReplySyncEvent>
  private stateSubject: Subject<State>

  private isSyncSubscriptions: Subscription[]
  private localLogootSOperationSubscription: Subscription
  private remoteQuerySyncSubscription: Subscription
  private remoteReplySyncSubscription: Subscription
  private remoteRichLogootSOperationSubscription: Subscription
  private storedStateSubscription: Subscription
  private triggerQuerySyncSubscription: Subscription

  constructor (id: number) {
    this.id = id
    this.isReadySubject = new Subject<void>()
    this.isSyncSubject = new Subject<void>()
    this.localRichLogootSOperationSubject = new Subject()
    this.querySyncSubject = new Subject()
    this.remoteLogootSOperationSubject = new Subject()
    this.remoteQuerySyncSubject = new Subject()
    this.remoteRichLogootSOperationSubject = new Subject()
    this.replySyncSubject = new Subject()
    this.stateSubject = new Subject()

    this.isSyncSubscriptions = []

    const isSyncSubscription = this.isSyncSubject.subscribe(() => {
      this.isSync = true
    })
    this.isSyncSubscriptions.push(isSyncSubscription)
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
    let buffer: Array<Map<number, number>> = []

    this.remoteQuerySyncSubscription = source.subscribe((vector: Map<number, number>) => {
      if (this.isSync) {
        this.remoteQuerySyncSubject.next(vector)
      } else {
        buffer.push(vector)
      }
    })

    const isSyncSubscription = this.isSyncSubject.subscribe(() => {
      buffer.forEach((vector: Map<number, number>) => {
        this.remoteQuerySyncSubject.next(vector)
      })
      buffer = []
    })
    this.isSyncSubscriptions.push(isSyncSubscription)

    this.remoteQuerySyncSubject.subscribe((vector: Map<number, number>) => {
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

      this.isSyncSubject.next()
    })
  }

  set remoteRichLogootSOperationSource (source: Observable<RichLogootSOperation>) {
    let buffer: Array<RichLogootSOperation> = []

    this.remoteRichLogootSOperationSubscription = source.subscribe((richLogootSOp: RichLogootSOperation) => {
      if (this.isSync) {
        this.remoteRichLogootSOperationSubject.next(richLogootSOp)
      } else {
        buffer.push(richLogootSOp)
      }
    })

    this.remoteRichLogootSOperationSubject.subscribe((richLogootSOp: RichLogootSOperation) => {
      this.applyRichLogootSOperations([richLogootSOp])
      this.stateSubject.next(this.state)
    })

    const isSyncSubscription = this.isSyncSubject.subscribe(() => {
      buffer.forEach((richLogootSOp: RichLogootSOperation) => {
        this.remoteRichLogootSOperationSubject.next(richLogootSOp)
      })
      buffer = []
    })
    this.isSyncSubscriptions.push(isSyncSubscription)
  }

  private set storedStateSource (source: Observable<State>) {
    this.storedStateSubscription = source.subscribe((state: State) => {
      this.vector.clear()
      this.applyRichLogootSOperations(state.richLogootSOps)
      this.isReadySubject.next(undefined)
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
    this.triggerQuerySyncSubscription = triggerQuerySyncObservable.subscribe((joinEvent: JoinEvent) => {
      if (!joinEvent.created) {
        this.querySyncSubject.next(this.vector)
      } else {
        this.isSync = true
      }
    })
  }

  clean (): void {
    this.isReadySubject.complete()
    this.localRichLogootSOperationSubject.complete()
    this.querySyncSubject.complete()
    this.remoteLogootSOperationSubject.complete()
    this.remoteQuerySyncSubject.complete()
    this.remoteRichLogootSOperationSubject.complete()
    this.replySyncSubject.complete()
    this.stateSubject.complete()

    this.isSyncSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe()
    })
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
      const minClockById = newRichLogootSOps.reduce((vector: Map<number, number>, richLogootSOp: RichLogootSOperation) => {
        // Keep only the oldest operation for each id
        const v = vector.get(richLogootSOp.id)
        if (v === undefined || v > richLogootSOp.clock) {
          vector.set(richLogootSOp.id, richLogootSOp.clock)
        }
        return vector
      }, new Map())

      let isNotAppliable = false
      minClockById.forEach((clock: number, id: number) => {
        if (!this.isAppliable(id, clock)) {
          isNotAppliable = true
        }
      })

      if (isNotAppliable) {
        this.isSync = false
        // Trigger a QuerySync message
        this.querySyncSubject.next(this.vector)
      } else {
        const logootSOperations: (LogootSAdd | LogootSDel)[] = []
        newRichLogootSOps
          .forEach((richLogootSOp) => {
            this.updateState(richLogootSOp)
            logootSOperations.push(richLogootSOp.logootSOp)
          })

        this.remoteLogootSOperationSubject.next(logootSOperations)
      }
    }
  }

  private updateState (richLogootSOp: RichLogootSOperation): void {
    console.assert(this.isAppliable(richLogootSOp.id, richLogootSOp.clock))
    this.vector.set(richLogootSOp.id, richLogootSOp.clock)
    this.richLogootSOps.push(richLogootSOp)
  }

  private isAlreadyApplied (id: number, clock: number): boolean {
    const v = this.vector.get(id)
    return v === undefined || v < clock
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
