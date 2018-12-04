import { Identifier, LogootSOperation, LogootSRopes, TextOperation } from 'mute-structs'
import { Document, Position } from '../../core'
import { sync } from '../../proto'

export class LSDocument extends Document<LogootSRopes, LogootSOperation> {
  constructor(rope: LogootSRopes) {
    super(rope)
    this._doc = rope
  }

  public handleLocalOperation(operations: TextOperation[]): void {
    operations.forEach((textOperation) => {
      const logootsop = textOperation.applyTo(this.doc)
      this.localOperationLogsSubject.next({ textop: textOperation, operation: logootsop })
      this.localOperationSubject.next(logootsop)
    })
  }
  public handleRemoteOperation(operation: LogootSOperation): TextOperation[] {
    const result = operation.execute(this.doc)
    this.remoteOperationLogsSubject.next({ textop: result, operation })
    return result
  }

  positionFromIndex(index: number): Position | undefined {
    const respIntnode = this.doc.searchNode(index)
    if (respIntnode !== null) {
      const offset = respIntnode.node.actualBegin + respIntnode.i
      return {
        id: Identifier.fromBase(respIntnode.node.getIdBegin(), offset),
        index: respIntnode.i,
      }
    }
    return undefined
  }

  indexFromId(id: sync.IdentifierMsg): number {
    // FIXME: should not use 'as Identifier'
    return this.doc.searchPos(Identifier.fromPlain(id) as Identifier, new Array())
  }
}
