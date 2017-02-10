import { LogootSDel, LogootSAdd } from 'mute-structs'
import { Observable, Subject, Subscription } from 'rxjs'

import { Interval } from './Interval'
import { ReplySyncEvent } from './ReplySyncEvent'
import { RichLogootSOperation } from './RichLogootSOperation'
import { State } from './State'

import { JoinEvent } from '../network/'

export class SyncService {

  private id: number = -1
  private clock: number = 0
  private vector: Map<number, number> = new Map()
  private richLogootSOps: RichLogootSOperation[] = []

  private isReadySubject: Subject<void>
  private localRichLogootSOperationSubject: Subject<RichLogootSOperation>
  private querySyncSubject: Subject<Map<number, number>>
  private remoteLogootSOperationSubject: Subject<LogootSAdd | LogootSDel>
  private replySyncSubject: Subject<ReplySyncEvent>
  private stateSubject: Subject<State>

  private joinSubscription: Subscription
  private localLogootSOperationSubscription: Subscription
  private remoteQuerySyncSubscription: Subscription
  private remoteReplySyncSubscription: Subscription
  private remoteRichLogootSOperationSubscription: Subscription
  private storedStateSubscription: Subscription

  constructor () {
    this.isReadySubject = new Subject<void>()
    this.localRichLogootSOperationSubject = new Subject()
    this.querySyncSubject = new Subject()
    this.remoteLogootSOperationSubject = new Subject()
    this.replySyncSubject = new Subject()
    this.stateSubject = new Subject()
  }

  get onLocalRichLogootSOperation (): Observable<RichLogootSOperation> {
    return this.localRichLogootSOperationSubject.asObservable()
  }

  get onQuerySync (): Observable<Map<number, number>> {
    return this.querySyncSubject.asObservable()
  }

  get onRemoteLogootSOperation (): Observable<LogootSAdd | LogootSDel> {
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

  set joinSource (source: Observable<JoinEvent>) {
    this.joinSubscription = source.map((joinEvent: JoinEvent) => {
        this.id = joinEvent.id
        return joinEvent
      }).subscribe((joinEvent: JoinEvent) => {
        // TODO: Delay the synchronization process until the stored version has been retrieved
        if (!joinEvent.created) {
          this.querySyncSubject.next(this.vector)
        }
      })
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
      replySyncEvent.richLogootSOps.forEach((richLogootSOp: RichLogootSOperation) => {
        this.applyRichLogootSOperation(richLogootSOp)
      })

      this.stateSubject.next(this.state)

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
      this.applyRichLogootSOperation(richLogootSOp)

      this.stateSubject.next(this.state)
    })
  }

  set storedStateSource (source: Observable<State>) {
    this.storedStateSubscription = source.subscribe((state: State) => {
      this.vector.clear()
      state.richLogootSOps.forEach((richLogootSOp: RichLogootSOperation) => {
        this.applyRichLogootSOperation(richLogootSOp)
      })
      this.isReadySubject.next(undefined)
    })
  }

  clean (): void {
    this.isReadySubject.complete()
    this.localRichLogootSOperationSubject.complete()
    this.querySyncSubject.complete()
    this.remoteLogootSOperationSubject.complete()
    this.replySyncSubject.complete()
    this.stateSubject.complete()

    this.joinSubscription.unsubscribe()
    this.localLogootSOperationSubscription.unsubscribe()
    this.remoteQuerySyncSubscription.unsubscribe()
    this.remoteReplySyncSubscription.unsubscribe()
    this.remoteRichLogootSOperationSubscription.unsubscribe()
    this.storedStateSubscription.unsubscribe()
  }

  applyRichLogootSOperation (richLogootSOp: RichLogootSOperation): void {
    this.updateState(richLogootSOp)
    this.remoteLogootSOperationSubject.next(richLogootSOp.logootSOp)
  }

  updateState (richLogootSOp: RichLogootSOperation): void {
    this.updateVector(richLogootSOp.id, richLogootSOp.clock)
    this.richLogootSOps.push(richLogootSOp)
  }

  updateVector (id: number, clock: number): void {
    const v = this.vector.get(id)
    if (v === undefined || v < clock) {
      this.vector.set(id, clock)
    }

    // TODO: Check if operation had previously been received
    // TODO: Check if some operations are missing
  }

}
