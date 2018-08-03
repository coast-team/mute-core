export interface IMessage {
  streamId: number
  content: Uint8Array
}

export interface IMessageIn extends IMessage {
  sernderId: number
}

export interface IMessageOut extends IMessage {
  recipientId?: number // O value means send to a random peer
}
