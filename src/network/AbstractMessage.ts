export abstract class AbstractMessage {
  constructor(readonly service: number, readonly content: Uint8Array) {}
}
