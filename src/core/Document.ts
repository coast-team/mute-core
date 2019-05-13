import { Identifier, TextOperation } from 'mute-structs'
import { Observable, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { ICollaborator } from '../collaborators'
import { Disposable } from '../misc'
import { IExperimentLogsDocument } from '../misc/IExperimentLogs'
import { sync } from '../proto'

export interface Position {
  id: Identifier
  index: number
}

export abstract class Document<Seq, Op> extends Disposable {
  protected _doc: Seq

  protected localOperationSubject: Subject<Op>
  protected remoteTextOperationSubject: Subject<{
    collaborator: ICollaborator | undefined
    operations: TextOperation[]
  }>

  protected localOperationLogsSubject: Subject<{ textop: TextOperation; operation: Op }>
  protected remoteOperationLogsSubject: Subject<{
    textop: TextOperation[]
    operation: Op
  }>

  protected digestSubject: Subject<number>
  protected updateSubject: Subject<void>

  protected experimentLogsSubject: Subject<IExperimentLogsDocument>

  constructor(sequenceCRDT: Seq) {
    super()
    this._doc = sequenceCRDT

    this.localOperationSubject = new Subject()
    this.remoteTextOperationSubject = new Subject()

    this.localOperationLogsSubject = new Subject()
    this.remoteOperationLogsSubject = new Subject()

    this.digestSubject = new Subject()
    this.updateSubject = new Subject()

    this.newSub = this.updateSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.digestSubject.next(this.getDigest())
    })
    this.experimentLogsSubject = new Subject()
  }

  dispose() {
    this.localOperationSubject.complete()
    this.remoteTextOperationSubject.complete()
    this.digestSubject.complete()
    this.updateSubject.complete()
    this.experimentLogsSubject.complete()
    super.dispose()
  }

  get doc(): Seq {
    return this._doc
  }

  set localTextOperations$(source: Observable<TextOperation[]>) {
    this.newSub = source.subscribe((textOperations) => {
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
    })
  }

  get remoteTextOperations$(): Observable<{
    collaborator: ICollaborator | undefined
    operations: TextOperation[]
  }> {
    return this.remoteTextOperationSubject.asObservable()
  }

  set remoteOperations$(
    source: Observable<{
      collaborator: ICollaborator | undefined
      operations: Op[]
    }>
  ) {
    this.newSub = source.subscribe(({ collaborator, operations }) => {
      const remoteOpes = operations
        .map((operation) => {
          const t3 = process.hrtime()
          const res = this.handleRemoteOperation(operation)
          const t4 = process.hrtime()
          this.experimentLogsSubject.next({
            type: 'remote',
            localOperation: res,
            operation,
            time3: t3,
            time4: t4,
            struct: this._doc,
          })

          return res
        })
        .reduce((acc, textOps) => acc.concat(textOps), [])
      this.remoteTextOperationSubject.next({ collaborator, operations: remoteOpes })
      this.updateSubject.next()
    })
  }

  get localOperations$(): Observable<Op> {
    return this.localOperationSubject.asObservable()
  }

  get localOperationLog$(): Observable<{ textop: TextOperation; operation: Op }> {
    return this.localOperationLogsSubject.asObservable()
  }

  get remoteOperationLog$(): Observable<{
    textop: TextOperation[]
    operation: Op
  }> {
    return this.remoteOperationLogsSubject.asObservable()
  }

  get digest$(): Observable<number> {
    return this.digestSubject.asObservable()
  }

  get experimentLogs$(): Observable<IExperimentLogsDocument> {
    return this.experimentLogsSubject.asObservable()
  }

  public abstract handleLocalOperation(operation: TextOperation): Op[]
  public abstract handleRemoteOperation(operation: Op): TextOperation[]

  public abstract positionFromIndex(index: number): Position | undefined
  public abstract indexFromId(id: sync.IdentifierMsg): number

  public abstract getDigest(): number
  protected abstract getStats(): any
}
