import { AbstractMessage } from './AbstractMessage'

export class SendToMessage extends AbstractMessage {
  constructor(service: number, readonly id: number, msg: Uint8Array) {
    super(service, msg)
  }
}
