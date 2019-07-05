import { StreamId } from '../Streams'

interface IMessage {
  streamId: StreamId
  content: Uint8Array
}

export interface IMessageIn extends IMessage {
  senderId: number
}

export interface IMessageOut extends IMessage {
  recipientId?: number // O value means send to a random peer
}
