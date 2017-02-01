export abstract class AbstractMessage {
  constructor(
    readonly service: string,
    readonly content: ArrayBuffer
  ) {}
}
