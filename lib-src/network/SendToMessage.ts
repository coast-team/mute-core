import { AbstractMessage } from './AbstractMessage'

export class SendToMessage extends AbstractMessage {
  constructor(
    service: string,
    readonly id: number,
    msg: ArrayBuffer) {
      super(service, msg)
    }
}
