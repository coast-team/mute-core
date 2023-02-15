import { StreamId } from '../Streams'

interface IMessage {
  streamId: StreamId
  content: Uint8Array
}

export interface IMessageIn extends IMessage {
  senderNetworkId: number
}

export interface IMessageOut extends IMessage {
  recipientNetworkId?: number // O value means send to a random peer
}
