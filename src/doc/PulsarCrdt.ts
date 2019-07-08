export class PulsarCrdt {
  private id: number
  private activatePulsar: boolean

  constructor(id: number, activatePulsar: boolean) {
    this.id = id
    this.activatePulsar = activatePulsar
  }

  merge(other: PulsarCrdt) {
    this.activatePulsar = other.activatePulsar || this.activatePulsar
  }

  setActivatePulsar(newActivatePulsar: boolean) {
    this.activatePulsar = newActivatePulsar
  }

  getState(): object {
    return { activatePulsar: this.activatePulsar, id: this.id }
  }

  get isPulsarActivated(): boolean {
    return this.activatePulsar
  }
}
