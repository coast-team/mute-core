import { AbstractMessage } from './AbstractMessage'

export class NetworkMessage extends AbstractMessage {
  constructor(
    service: number,
    readonly id: number,
    readonly isBroadcast: boolean,
    content: Uint8Array
  ) {
    super(service, content)
  }
}
