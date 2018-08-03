import { Observable, Subject, Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'

import { Disposable } from './Disposable'
import { IMessageIn, IMessageOut } from './network'
import { Streams } from './Streams'

export abstract class Service extends Disposable {
  protected messageIn: Observable<IMessageIn>

  private messageOut: Subject<IMessageOut>
  private streamId: Streams

  constructor(
    messageIn: Observable<IMessageIn>,
    messageOut: Subject<IMessageOut>,
    myStreamId: Streams
  ) {
    super()
    this.messageIn = messageIn.pipe(filter(({ streamId }) => streamId === myStreamId))
    this.messageOut = messageOut
    this.streamId = myStreamId
  }

  protected send(content: Uint8Array, recipientId?: number) {
    this.messageOut.next({
      streamId: this.streamId,
      recipientId,
      content,
    })
  }
}
