export class JoinEvent {
  constructor (
    readonly id: number,
    readonly key: string,
    readonly created: boolean,
  ) {}
}
