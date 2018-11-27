import { RichOperation } from './RichOperation'

export abstract class State<Seq, Op> {
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
      remoteOperations: this._remoteOperations,
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
