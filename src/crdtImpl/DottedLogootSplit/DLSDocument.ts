import { Del, Ins, SimpleDotPos } from 'dotted-logootsplit'
import { OpEditableReplicatedList } from 'dotted-logootsplit/dist/types/core/op-replicated-list'
import { TextDelete, TextInsert, TextOperation } from 'mute-structs'
import { Document, Position } from '../../core'
import { sync } from '../../proto'
import { BlockOperation } from './DLSRichOperation'

export class DLSDocument extends Document<
  OpEditableReplicatedList<SimpleDotPos, string>,
  BlockOperation
> {
  public handleLocalOperation(operation: TextOperation): BlockOperation {
    if (operation instanceof TextInsert) {
      const blockOperation = this._doc.insertAt(operation.index, operation.content)
      this.localOperationLogsSubject.next({ textop: operation, operation: blockOperation })
      this.localOperationSubject.next(blockOperation)
      return blockOperation
    } else if (operation instanceof TextDelete) {
      const blockOperationList = this._doc.removeAt(operation.index, operation.length)
      blockOperationList.forEach((blockOperation) => {
        this.localOperationLogsSubject.next({ textop: operation, operation: blockOperation })
        this.localOperationSubject.next(blockOperation)
      })
      return blockOperationList[0] // DOESNT SEEMS TO WORK !
    } else {
      throw new Error('operation is unknown')
    }
  }

  public handleRemoteOperation(operation: BlockOperation): TextOperation[] {
    const res = this._doc.applyOp(operation)
    const tab: TextOperation[] = []
    res.forEach((ope) => {
      if (ope instanceof Ins) {
        // tslint:disable-next-line:no-bitwise
        tab.push(new TextInsert(ope.index, ope.content, operation.replica() | 0))
      } else if (ope instanceof Del) {
        // tslint:disable-next-line:no-bitwise
        tab.push(new TextDelete(ope.index, ope.length, operation.replica() | 0))
      }
    })
    return tab
  }

  public positionFromIndex(_index: number): Position | undefined {
    return undefined
  }

  public indexFromId(_id: sync.IdentifierMsg): number {
    return 0
  }

  public getDigest(): number {
    return this.doc.structuralHashCode()
  }

  protected getStats() {
    return { stats: 'Not implemented yet' }
  }
}
