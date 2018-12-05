import { RichOperation } from './RichOperation'

export interface StateJSON<Seq, Op> {
  readonly vector: Array<[number, number]>
  readonly remoteOperations: Array<RichOperation<Op>>
  readonly sequenceCRDT: Seq
  readonly networkClock: number
  readonly id: number
}

export abstract class State<Seq, Op> {
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

  protected _sequenceCRDT: Seq
  protected _remoteOperations: Array<RichOperation<Op>>
  protected _networkClock: number
  protected _id: number
  protected _vector: Map<number, number>

  constructor(
    id: number,
    sequenceCRDT: Seq,
    remoteOperations: Array<RichOperation<Op>>,
    vector: Map<number, number>,
    networkClock: number
  ) {
    this._id = id
    this._sequenceCRDT = sequenceCRDT
    this._remoteOperations = remoteOperations
    this._vector = vector
    this._networkClock = networkClock
  }

  toJSON(): string {
    return JSON.stringify({
      vector: Array.from(this._vector),
      remoteOperations: this._remoteOperations.map((richOperation) => richOperation.toJson()),
      sequenceCRDT: this._sequenceCRDT,
      networkClock: this._networkClock,
      id: this._id,
    })
  }

  get id(): number {
    return this._id
  }

  get remoteOperations(): Array<RichOperation<Op>> {
    return this._remoteOperations
  }

  set remoteOperations(ops: Array<RichOperation<Op>>) {
    this._remoteOperations = ops
  }

  get sequenceCRDT(): Seq {
    return this._sequenceCRDT
  }

  get networkClock(): number {
    return this._networkClock
  }

  get vector(): Map<number, number> {
    return this._vector
  }
}
