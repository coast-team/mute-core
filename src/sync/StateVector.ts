import { Interval } from './Interval'

/**
 * Keep track of the messages delivered by peers
 * Allow to maintain the causal delivery per peer
 */
export class StateVector {

  private vector: Map<number, number>

  constructor (otherMap?: Map<number, number>) {
    if (otherMap) {
      otherMap.forEach((value: number) => {
        console.assert(value >= 0, 'Each value of a state vector must be positive')
      })
    }
    this.vector = new Map(otherMap)
  }

  get (id: number): number | undefined {
    return this.vector.get(id)
  }

    /**
     * Update the registered clock for a peer
     * The clock must be valid for the update to be perform
     * @param id The peer id
     * @param clock The message clock
     */
  set (id: number, clock: number): void {
    console.assert(clock >= 0, 'clock must be positive')
    console.assert(this.isDeliverable(id, clock))
    this.vector.set(id, clock)
  }

  clear (): void {
    this.vector.clear()
  }

  get size (): number {
    return this.vector.size
  }

    /**
     * Check if a message has already been delivered
     * @param id The peer id
     * @param clock The message clock
     */
  isAlreadyDelivered (id: number, clock: number): boolean {
    const v = this.get(id)
    return v !== undefined && v >= clock
  }

    /**
     * Check if a message can be delivered
     * A message can be delivered if:
     *   - It is a new peer and the clock is equal to 0
     *   - The clock is equal to the registered clock + 1
     * @param id The peer id
     * @param clock The message clock
     */
  isDeliverable (id: number, clock: number): boolean {
    if (this.isAlreadyDelivered(id, clock)) {
      return false
    }
    const v = this.get(id)
    if (v === undefined) {
      return clock === 0
    }
    return clock === v + 1
  }

  forEach (f: (clock?: number, id?: number) => void): void {
    this.vector.forEach(f)
  }

  asMap (): Map<number, number> {
    return new Map(this.vector)
  }

    /**
     * Compute the intervals representing the messages known by other but not by this
     * @param other
     */
  computeMissingIntervals (other: StateVector): Interval[] {
    const missingIntervals: Interval[] = []
    other.vector.forEach((clock: number, id: number) => {
      const v = this.get(id)
      if (v === undefined) {
        const begin = 0
        const end: number = clock
        missingIntervals.push(new Interval(id, begin, end))
      } else if (v < clock) {
        const begin: number = v + 1
        const end: number = clock
        missingIntervals.push(new Interval(id, begin, end))
      }
    })

    return missingIntervals
  }
}
