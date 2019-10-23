import {
  LogootSRename,
  RenamableListOperation,
  RenamableLogootSAdd,
  RenamableLogootSDel,
} from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { RichOperation, SyncMessage } from '../../core'
import { IMessageIn, IMessageOut } from '../../misc'
import { sync as proto } from '../../proto'
import { RLSRichOperation } from './RLSRichOperation'

export class RLSSyncMessage extends SyncMessage<RenamableListOperation> {
  constructor(messageIn$: Observable<IMessageIn>, messageOut$: Subject<IMessageOut>) {
    super(messageIn$, messageOut$)
  }

  protected serializeRichOperation(
    richOperation: RichOperation<RenamableListOperation>
  ): proto.RichOperationMsg {
    const { id, clock, operation, dependencies } = richOperation
    const d: { [k: string]: number } = Array.from(dependencies).reduce(
      (acc: { [k: string]: number }, [key, value]) => {
        acc[key + ''] = value
        return acc
      },
      {}
    )

    let prop = 'renamableLogootSAdd'
    if (richOperation.operation instanceof RenamableLogootSDel) {
      prop = 'renamableLogootSDel'
    } else if (richOperation.operation instanceof LogootSRename) {
      prop = 'logootSRename'
    }
    const res = proto.RichOperationMsg.create({
      richRenamableLogootSOpMsg: {
        id,
        clock,
        [prop]: operation,
        dependencies: d,
      },
    })

    return res
  }
  protected deserializeRichOperation(richOperationMsg: proto.RichOperationMsg): RLSRichOperation {
    const msg = richOperationMsg.richRenamableLogootSOpMsg

    if (msg && msg.dependencies && typeof msg.dependencies === 'object') {
      const addOp = RenamableLogootSAdd.fromPlain(msg.renamableLogootSAdd)
      const delOp = RenamableLogootSDel.fromPlain(msg.renamableLogootSDel)
      const renameOp = LogootSRename.fromPlain(msg.logootSRename)

      const dependencies = Object.entries(msg.dependencies).map(([key, value]) => [
        parseInt(key, 10),
        value,
      ])

      const op = RLSRichOperation.fromPlain({
        id: msg.id,
        clock: msg.clock,
        operation: addOp || delOp || renameOp,
        dependencies,
      })

      if (op) {
        return op
      } else {
        throw new Error('Error in fromPlain')
      }
    } else {
      throw new Error("Can't deserialize the RichOperation message : " + richOperationMsg)
    }
  }
}
