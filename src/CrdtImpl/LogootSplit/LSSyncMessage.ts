import { LogootSAdd, LogootSDel, LogootSOperation } from "mute-structs";
import { Observable, Subject } from "rxjs";
import { RichOperation, SyncMessage } from "../../core";
import { IMessageIn, IMessageOut } from "../../misc";
import { sync as proto } from "../../proto";
import { LSRichOperation } from "./LSRichOperation";

export class LSSyncMessage extends SyncMessage<LogootSOperation>{
  constructor (messageIn$: Observable<IMessageIn>, messageOut$: Subject<IMessageOut>) {
    super(messageIn$, messageOut$)
  }

  protected serializeRichOperation (richOperation: RichOperation<LogootSOperation>): proto.RichOperationMsg {
    const { id, clock, operation: logootSOp, dependencies } = richOperation
    const d = Array.from(dependencies).reduce((acc: object, v) => {
      const key: string = v[0] + ''
      const obj = Object.create({})
      obj[key] = v[1]
      return { ...acc, ...obj }
    }, {})
    const logootMsg = proto.RichLogootSOperationMsg.create({ id, clock, dependencies: d })

    const res = proto.RichOperationMsg.create({ richLogootSOpsMsg: logootMsg })
    if (res.richLogootSOpsMsg) {
      if (logootSOp instanceof LogootSDel) {
        res.richLogootSOpsMsg.logootSDelMsg = proto.LogootSDelMsg.create(logootSOp)
      } else if (logootSOp instanceof LogootSAdd) {
        res.richLogootSOpsMsg.logootSAddMsg = proto.LogootSAddMsg.create(logootSOp)
      }
    }

    return res
  }
  protected deserializeRichOperation (richOperationMsg: proto.RichOperationMsg): RichOperation<LogootSOperation> {
    if (richOperationMsg.richLogootSOpsMsg) {
      const addOpe = LogootSAdd.fromPlain(richOperationMsg.richLogootSOpsMsg.logootSAddMsg)
      const delOpe = LogootSDel.fromPlain(richOperationMsg.richLogootSOpsMsg.logootSDelMsg)
      return LSRichOperation.fromPlain({
        id: richOperationMsg.richLogootSOpsMsg.id,
        clock: richOperationMsg.richLogootSOpsMsg.clock,
        operation: addOpe || delOpe,
        dependencies: richOperationMsg.richLogootSOpsMsg.dependencies,
      }) as RichOperation<LogootSOperation>
    } else {
      throw new Error('Can\'t deserialize the RichOperation message : ' + richOperationMsg)
    }
  }
}