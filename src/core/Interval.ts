export class Interval {
  readonly id: number
  readonly begin: number
  readonly end: number

  constructor(id: number, begin: number, end: number) {
    this.id = id
    this.begin = begin
    this.end = end
  }

  equals(aOther: Interval): boolean {
    return this.id === aOther.id && this.begin === aOther.begin && this.end === aOther.end
  }
}
