import {
  LogootSOperation,
  RenamableListOperation,
  RenamableLogootSOperation,
  RenamableReplicableList,
  TextDelete,
  TextInsert,
  TextOperation,
} from 'mute-structs'
import { Observable } from 'rxjs'

import { Document, Position } from '../../core'
import { sync } from '../../proto'

export class RLSDocument extends Document<RenamableReplicableList, RenamableListOperation> {
  set localTextOperations$(source: Observable<TextOperation[]>) {
    this.newSub = source.subscribe((textOperations) => {
      if (textOperations.length > 0) {
        textOperations.forEach((ope) => {
          const t4 = process.hrtime()
          const remoteOp = this.handleLocalOperation(ope)
          const t3 = process.hrtime()
          this.experimentLogsSubject.next({
            type: 'local',
            localOperation: ope,
            operation: remoteOp,
            time3: t3,
            time4: t4,
            struct: this._doc,
          })
          remoteOp.forEach((remote) => {
            this.localOperationLogsSubject.next({ textop: ope, operation: remote })
            this.localOperationSubject.next(remote)
          })
        })
        this.updateSubject.next()
      } else {
        const time4 = process.hrtime()
        const remoteOp = this.doc.renameLocal()
        const time3 = process.hrtime()
        this.experimentLogsSubject.next({
          type: 'local',
          localOperation: {},
          operation: [remoteOp],
          time3,
          time4,
          struct: this._doc,
        })
        this.localOperationSubject.next(remoteOp)
      }
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

  getStats() {
    return {}
  }

  handleLocalOperation(textOp: TextOperation): RenamableListOperation[] {
    if (textOp instanceof TextInsert) {
      return [this.doc.insertLocal(textOp.index, textOp.content)]
    } else if (textOp instanceof TextDelete) {
      return [this.doc.delLocal(textOp.index, textOp.index + textOp.length - 1)]
    } else {
      throw new Error(
        `RLSDocument.applyTextOp: tried to handle an operation which is neither a TextInsert nor a TextDelete: ${textOp}`
      )
    }
  }
}
