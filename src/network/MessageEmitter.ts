import { Observable } from 'rxjs/Observable'

import { BroadcastMessage } from './BroadcastMessage'
import { SendRandomlyMessage } from './SendRandomlyMessage'
import { SendToMessage } from './SendToMessage'

export interface MessageEmitter {
  readonly onMsgToBroadcast: Observable<BroadcastMessage>
  readonly onMsgToSendTo: Observable<SendToMessage>
  readonly onMsgToSendRandomly: Observable<SendRandomlyMessage>
}
