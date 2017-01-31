export class NetworkMessage {
  constructor (
    readonly service: string,
    readonly id: number,
    readonly isBroadcast: boolean,
    readonly content: ArrayBuffer
  ) {}
}
