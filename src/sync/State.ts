import { LogootSRopes } from 'mute-structs'
import { SafeAny } from 'safe-any'
import { RichLogootSOperation } from './RichLogootSOperation'

interface StateJSON {
  readonly vector: Array<[number, number]>
  readonly richLogootSOps: RichLogootSOperation[]
  readonly logootsRopes: LogootSRopes
  readonly networkClock: number
  readonly id: number
}

export class State {
  static isArray(o: any): o is Array<[number, number]> {
    let res = true
    if (o instanceof Array) {
      o.forEach((value) => {
        if (value instanceof Array) {
          if (value.length !== 2 || typeof value[0] !== 'number' || typeof value[1] !== 'number') {
            res = false
          }
        } else {
          res = false
        }
      })
    } else {
      res = false
    }
    return res
  }

  static emptyState() {
    return new State(new Map(), [], new LogootSRopes(), 0, 0)
  }

  static fromPlainText(o: SafeAny<StateJSON>): State | null {
    if (o !== null && typeof o === 'object' && o.richLogootSOps instanceof Array) {
      // If one operation is null -> error
      const richLogootSOps = o.richLogootSOps.map((rich) => {
        return RichLogootSOperation.fromPlain(rich)
      }) as RichLogootSOperation[]
      const nbOperationNull = richLogootSOps.filter((r) => r === null).length
      if (nbOperationNull > 0) {
        return null
      }

      // If the vector and the logootsRopes are null -> v1 else v2
      if (
        this.isArray(o.vector) &&
        o.logootsRopes &&
        typeof o.logootsRopes === 'object' &&
        typeof o.logootsRopes.replicaNumber === 'number' &&
        Number.isInteger(o.logootsRopes.replicaNumber) &&
        typeof o.logootsRopes.clock === 'number'
      ) {
        const vector = new Map(o.vector)
        const logootsRopes = LogootSRopes.fromPlain(
          o.logootsRopes.replicaNumber,
          o.logootsRopes.clock,
          o.logootsRopes
        )
        if (!logootsRopes) {
          return null
        }

        let networkClock
        if (typeof o.networkClock === 'number' && Number.isInteger(o.networkClock)) {
          networkClock = o.networkClock
        } else {
          return null
        }

        let id
        if (typeof o.id === 'number' && Number.isInteger(o.id)) {
          id = o.id
        } else {
          return null
        }

        return new State(vector, richLogootSOps, logootsRopes, networkClock, id)
      } else {
        // We create the state thanks to operations / we assume that operations are ordered
        const state = new State(new Map(), [], new LogootSRopes(), 0, 0)
        richLogootSOps.forEach((richOp) => {
          state.vector.set(richOp.id, richOp.clock)
          richOp.logootSOp.execute(state.logootsRopes)
        })
        return state
      }
    }
    return null
  }

  readonly vector: Map<number, number>
  readonly richLogootSOps: RichLogootSOperation[]
  readonly logootsRopes: LogootSRopes
  readonly networkClock: number
  id: number

  constructor(
    vector: Map<number, number>,
    richLogootSOps: RichLogootSOperation[],
    logootsRopes: LogootSRopes,
    networkClock: number,
    id: number
  ) {
    this.vector = vector
    this.richLogootSOps = richLogootSOps
    this.logootsRopes = logootsRopes
    this.networkClock = networkClock
    this.id = id
  }

  toJSON(): string {
    return JSON.stringify({
      vector: Array.from(this.vector),
      richLogootSOps: this.richLogootSOps,
      logootsRopes: this.logootsRopes,
      networkClock: this.networkClock,
      id: this.id,
    })
  }
}
