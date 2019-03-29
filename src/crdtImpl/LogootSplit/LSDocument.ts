import { Identifier, LogootSOperation, LogootSRopes, Stats, TextOperation } from 'mute-structs'
import { Document, Position } from '../../core'
import { sync } from '../../proto'

export class LSDocument extends Document<LogootSRopes, LogootSOperation> {
  constructor(rope: LogootSRopes) {
    super(rope)
    this._doc = rope
  }

  public handleLocalOperation(operation: TextOperation): LogootSOperation {
    return operation.applyTo(this.doc)
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

  getStats() {
    const stat = new Stats(this._doc)
    return {
      documentLength: stat.documentLength,
      numberOfNodes: stat.numberOfNodes,
      treeHeight: stat.treeHeight,
      minIdentifierLength: stat.minIdentifierLength,
      maxIdentifierLength: stat.maxIdentifierLength,
      meanIdentifierLength: stat.meanIdentifierLength,
      medianIdentifierLength: stat.medianIdentifierLength,
      repartitionIdentifierLength: Array.from(stat.repartitionIdentifierLength),
      minNodeLength: stat.minNodeLength,
      maxNodeLength: stat.maxNodeLength,
      meanNodeLength: stat.meanNodeLength,
      medianNodeLength: stat.medianNodeLength,
      repartitionNodeLength: Array.from(stat.repartitionNodeLength),
    }
  }

  public getDigest(): number {
    return this.doc.digest()
  }
}
