import { RichOperation, SyncMessage } from '../../core'
import { sync as proto } from '../../proto'
import { BlockOperation, FIFODLSRichOperation } from './FIFODLSRichOperation'

export class FIFODLSSyncMessage extends SyncMessage<BlockOperation> {
  protected serializeRichOperation(
    richOperation: RichOperation<BlockOperation>
  ): proto.RichOperationMsg {
    const { id, clock, operation: blockOperation, dependencies } = richOperation
    const d: { [k: string]: number } = Array.from(dependencies).reduce(
      (acc: { [k: string]: number }, v) => {
        const key: string = v[0] + ''
        const obj = Object.create({})
        obj[key] = v[1]
        return { ...acc, ...obj }
      },
      {}
    )

    const dottedLogootMsg = proto.RichDottedLogootSOperationMsg.create({
      id,
      clock,
      dependencies: d,
    })
    const res = proto.RichOperationMsg.create({ richDottedLogootsOpsMsg: dottedLogootMsg })

    // Create BlockMessage
    const posParts: proto.ISimpleDotPosPart[] = []
    blockOperation.lowerPos.parts.forEach((part) => {
      posParts.push(
        proto.SimpleDotPosPart.create({
          priority: part.priority,
          replica: part.replica,
          seq: part.seq,
        })
      )
    })
    const simplePosMsg = proto.SimpleDotPos.create({ parts: posParts })

    if (res.richDottedLogootsOpsMsg) {
      if (blockOperation.isLengthBlock()) {
        const dottedMsg = proto.DottedLogootSBlockMsg.create({
          lowerPos: simplePosMsg,
          concatLength: blockOperation.content,
        })
        res.richDottedLogootsOpsMsg.blockOperationMsg = dottedMsg
      } else {
        const dottedMsg = proto.DottedLogootSBlockMsg.create({
          lowerPos: simplePosMsg,
          content: blockOperation.content,
        })
        res.richDottedLogootsOpsMsg.blockOperationMsg = dottedMsg
      }
    }

    return res
  }

  protected deserializeRichOperation(
    richOperationMsg: proto.RichOperationMsg
  ): RichOperation<BlockOperation> {
    if (richOperationMsg.richDottedLogootsOpsMsg) {
      const dependencies = new Map<number, number>()
      const d = richOperationMsg.richDottedLogootsOpsMsg.dependencies
      if (d && typeof d === 'object') {
        Object.entries(d).forEach((v) => {
          dependencies.set(parseInt(v[0], 10), v[1])
        })
      }

      if (richOperationMsg.richDottedLogootsOpsMsg.blockOperationMsg) {
        const operation = {
          lowerPos: richOperationMsg.richDottedLogootsOpsMsg.blockOperationMsg.lowerPos,
          content:
            richOperationMsg.richDottedLogootsOpsMsg.blockOperationMsg.content ||
            richOperationMsg.richDottedLogootsOpsMsg.blockOperationMsg.concatLength,
        }
        const op = FIFODLSRichOperation.fromPlain({
          id: richOperationMsg.richDottedLogootsOpsMsg.id,
          clock: richOperationMsg.richDottedLogootsOpsMsg.clock,
          operation,
          dependencies,
        })

        if (op) {
          return op
        } else {
          throw new Error('Error in fromPlain operation')
        }
      } else {
        throw new Error('Error in fromPlain')
      }
    } else {
      throw new Error("Can't deserialize the RichOperation message : " + richOperationMsg)
    }
  }
}
