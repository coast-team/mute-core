import { Identifier, LogootSOperation, LogootSRopes, TextOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ICollaborator } from '../collaborators'
import { Disposable } from '../misc'
import { sync } from '../proto'

export interface Position {
  id: Identifier
  index: number
}

export class Document extends Disposable {
  private doc: LogootSRopes

  private digestSubject: Subject<number>
  private treeSubject: Subject<string>
  private localLogootSOperationsSubject: Subject<LogootSOperation>
  private remoteTextOperationsSubject: Subject<{
    collaborator: ICollaborator | undefined
    operations: TextOperation[]
  }>
  private localOperationLogsSubject: Subject<{ textop: TextOperation; logootsop: LogootSOperation }>
  private remoteOperationLogsSubject: Subject<{
    textop: TextOperation[]
    logootsop: LogootSOperation
  }>
  private updateSubject: Subject<void>

  constructor(id: number) {
    super()
    this.doc = new LogootSRopes(id)

    this.digestSubject = new Subject()
    this.treeSubject = new Subject()
    this.localLogootSOperationsSubject = new Subject()
    this.remoteTextOperationsSubject = new Subject()
    this.localOperationLogsSubject = new Subject()
    this.remoteOperationLogsSubject = new Subject()
    this.updateSubject = new Subject()

    this.newSub = this.updateSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.treeSubject.next(JSON.stringify(this.doc))
      this.digestSubject.next(this.doc.digest())
    })
  }

  // getContentAsString(state: State): string {
  //   const res: string[] = []
  //   for (const { logootSOp } of state.richLogootSOps) {
  //     for (const to of this.handleRemoteOperation(logootSOp)) {
  //       if (to instanceof TextDelete) {
  //         res.splice(to.offset, to.length)
  //       } else {
  //         res.splice(to.offset, 0, to.content)
  //       }
  //     }
  //   }
  //   return res.join('')
  // }

  set localTextOperations$(source: Observable<TextOperation[]>) {
    this.newSub = source.subscribe((textOperations) => {
      this.handleTextOperations(textOperations)
      this.updateSubject.next()
    })
  }

  set remoteLogootSOperations$(
    source: Observable<{
      collaborator: ICollaborator | undefined
      operations: LogootSOperation[]
    }>
  ) {
    this.newSub = source.subscribe(({ collaborator, operations }) => {
      const remoteTextOps = operations
        .map((op) => this.handleRemoteOperation(op))
        .reduce((acc, textOps) => acc.concat(textOps), [])
      this.remoteTextOperationsSubject.next({
        collaborator,
        operations: remoteTextOps,
      })
      this.updateSubject.next()
    })
  }

  get digest$(): Observable<number> {
    return this.digestSubject.asObservable()
  }

  get tree$(): Observable<string> {
    return this.treeSubject.asObservable()
  }

  get localLogootSOperations$(): Observable<LogootSOperation> {
    return this.localLogootSOperationsSubject.asObservable()
  }

  get remoteTextOperations$(): Observable<{
    collaborator: ICollaborator | undefined
    operations: TextOperation[]
  }> {
    return this.remoteTextOperationsSubject.asObservable()
  }

  get localOperationLog$(): Observable<{ textop: TextOperation; logootsop: LogootSOperation }> {
    return this.localOperationLogsSubject.asObservable()
  }

  get remoteOperationLog$(): Observable<{ textop: TextOperation[]; logootsop: LogootSOperation }> {
    return this.remoteOperationLogsSubject.asObservable()
  }

  dispose(): void {
    this.localLogootSOperationsSubject.complete()
    this.remoteTextOperationsSubject.complete()
    this.updateSubject.complete()
    super.dispose()
  }

  handleTextOperations(textOperations: TextOperation[]): void {
    textOperations.forEach((textOperation) => {
      const logootsop = textOperation.applyTo(this.doc)
      this.localOperationLogsSubject.next({ textop: textOperation, logootsop })
      this.localLogootSOperationsSubject.next(logootsop)
    })
    // log.info('operation:doc', 'updated doc: ', this.doc)
  }

  handleRemoteOperation(logootSOperation: LogootSOperation): TextOperation[] {
    const result = logootSOperation.execute(this.doc)
    this.remoteOperationLogsSubject.next({ textop: result, logootsop: logootSOperation })
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
