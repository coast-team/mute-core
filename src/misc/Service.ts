import { Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

import { Streams, StreamsSubtype } from '../Streams'
import { Disposable } from './Disposable'
import { IMessageIn, IMessageOut } from './IMessage'

export interface IMessageFactory<OutMsg, InMsg extends OutMsg> {
  create: (properties?: OutMsg) => InMsg
  encode: (message: OutMsg) => { finish: () => Uint8Array }
  decode: (reader: Uint8Array) => InMsg
}

export abstract class Service<OutMsg, InMsg extends OutMsg> extends Disposable {
  protected messageIn$: Observable<{ senderId: number; msg: InMsg }>

  private messageOut$: Subject<IMessageOut>
  private streamId: Streams
  /*
   * Service protobufjs object generated from `.proto` file.
   */
  private proto: IMessageFactory<OutMsg, InMsg>

  constructor(
    messageIn: Observable<IMessageIn>,
    messageOut: Subject<IMessageOut>,
    myStreamId: Streams,
    proto: IMessageFactory<OutMsg, InMsg>
  ) {
    super()
    this.proto = proto
    this.messageIn$ = messageIn.pipe(
      filter(({ streamId }) => streamId.type === myStreamId),
      map(({ senderId, content }) => ({ senderId, msg: proto.decode(content) }))
    )
    this.messageOut$ = messageOut
    this.streamId = myStreamId
  }

  protected send(msg: OutMsg, subtype: StreamsSubtype, recipientId?: number) {
    console.log("Service.ts - send - recipientId?: " + recipientId)
    this.messageOut$.next({
      streamId: { type: this.streamId, subtype },
      recipientId,
      content: this.proto.encode(this.proto.create(msg)).finish(),
    })
  }
}
