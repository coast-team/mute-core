import {
  LogootSOperation,
  RenamableLogootSOperation,
  RenamableReplicableList,
  TextDelete,
  TextInsert,
  TextOperation,
} from 'mute-structs'
import { Document, Position } from '../../core'
import { sync } from '../../proto'

export class RLSDocument extends Document<
  RenamableReplicableList,
  RenamableLogootSOperation<LogootSOperation>
> {
  public handleLocalOperation(textOps: TextOperation[]): void {
    textOps.forEach((textOp) => {
      const remoteOp = this.applyTextOp(textOp)
      this.localOperationLogsSubject.next({ textop: textOp, operation: remoteOp })
      this.localOperationSubject.next(remoteOp)
    })
  }

  public handleRemoteOperation(
    operation: RenamableLogootSOperation<LogootSOperation>
  ): TextOperation[] {
    const result = operation.execute(this.doc)
    this.remoteOperationLogsSubject.next({ textop: result, operation })
    return result
  }

  positionFromIndex(index: number): Position | undefined {
    // TODO: To implement
    console.log(index)
    return undefined
  }

  indexFromId(id: sync.IdentifierMsg): number {
    // TODO: To implement
    console.log(id)
    return 0
  }

  public getDigest(): number {
    return this.doc.digest()
  }

  private applyTextOp(textOp: TextOperation): RenamableLogootSOperation<LogootSOperation> {
    if (textOp instanceof TextInsert) {
      return this.doc.insertLocal(textOp.index, textOp.content)
    } else if (textOp instanceof TextDelete) {
      return this.doc.delLocal(textOp.index, textOp.index + textOp.length - 1)
    } else {
      throw new Error(
        `RLSDocument.applyTextOp: tried to handle an operation which is neither a TextInsert nor a TextDelete: ${textOp}`
      )
    }
  }
}
