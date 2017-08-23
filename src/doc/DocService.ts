import { Observable, Subject } from 'rxjs'
import {
  LogootSOperation,
  LogootSRopes,
  Identifier,
  TextOperation
} from 'mute-structs'

import { JoinEvent } from '../network/'

export class DocService {

  private disposeSubject: Subject<void>

  private doc: LogootSRopes
  private docID: string

  private docDigestSubject: Subject<number>
  private docTreeSubject: Subject<string>
  private docValueSubject: Subject<string>
  private localLogootSOperationSubject: Subject<LogootSOperation>
  private remoteTextOperationsSubject: Subject<(TextOperation)[]>
  private updateSubject: Subject<void>

  constructor (id: number) {
    this.doc = new LogootSRopes(id)

    this.disposeSubject = new Subject<void>()
    this.docDigestSubject = new Subject()
    this.docTreeSubject = new Subject()
    this.docValueSubject = new Subject()
    this.localLogootSOperationSubject = new Subject()
    this.remoteTextOperationsSubject = new Subject()
    this.updateSubject = new Subject()

    this.updateSubject
      .takeUntil(this.disposeSubject)
      .debounceTime(1000)
      .subscribe(() => {
        this.docTreeSubject.next(JSON.stringify(this.doc))
        this.docDigestSubject.next(this.doc.digest())
      })
  }

  set initSource (source: Observable<string>) {
    source
      .takeUntil(this.disposeSubject)
      .subscribe( (key: string) => {
        this.docID = key
        this.docValueSubject.next(this.doc.str)
      })
  }

  set localTextOperationsSource (source: Observable<(TextOperation)[][]>) {
    source
      .takeUntil(this.disposeSubject)
      .subscribe((textOperations: (TextOperation)[][]) => {
        this.handleTextOperations(textOperations)
        this.updateSubject.next()
      })
  }

  set remoteLogootSOperationSource (source: Observable<(LogootSOperation)[]>) {
    source
      .takeUntil(this.disposeSubject)
      .subscribe((logootSOps: (LogootSOperation)[]) => {
        const remoteTextOps: (TextOperation)[] =
          logootSOps
            .map((logootSOp: LogootSOperation) => {
              return this.handleRemoteOperation(logootSOp)
            })
            .reduce((acc: (TextOperation)[], textOps: (TextOperation)[]) => {
              return acc.concat(textOps)
            }, [])
        this.remoteTextOperationsSubject.next(remoteTextOps)
        this.updateSubject.next()
      })
  }

  get onDocDigest (): Observable<number> {
    return this.docDigestSubject.asObservable()
  }

  get onDocTree (): Observable<string> {
    return this.docTreeSubject.asObservable()
  }

  get onDocValue (): Observable<string> {
    return this.docValueSubject.asObservable()
  }

  get onLocalLogootSOperation (): Observable<LogootSOperation> {
    return this.localLogootSOperationSubject.asObservable()
  }

  get onRemoteTextOperations (): Observable<(TextOperation)[]> {
    return this.remoteTextOperationsSubject.asObservable()
  }

  clean (): void {
    this.disposeSubject.complete()
    this.docValueSubject.complete()
    this.localLogootSOperationSubject.complete()
    this.remoteTextOperationsSubject.complete()
    this.updateSubject.complete()
  }

  handleTextOperations (array: TextOperation[][]): void {
    array.forEach( (textOperations: TextOperation[]) => {
      textOperations.forEach( (textOperation: TextOperation) => {
        const logootSOperation: LogootSOperation = textOperation.applyTo(this.doc)
        this.localLogootSOperationSubject.next(logootSOperation)
      })
    })
    // log.info('operation:doc', 'updated doc: ', this.doc)
  }

  handleRemoteOperation (logootSOperation: LogootSOperation): (TextOperation)[] {
    const textOperations: TextOperation[] = logootSOperation.execute(this.doc)
    // log.info('operation:doc', 'updated doc: ', this.doc)
    return textOperations
  }

  idFromIndex (index: number): {index: number, last: number, base: number[]} | null {
    let respIntnode = this.doc.searchNode(index)
    if (respIntnode !== null) {
      return {
        index: respIntnode.i,
        last: respIntnode.node.actualBegin + respIntnode.i,
        base: respIntnode.node.block.idInterval.base
      }
    }
    return null
  }

  indexFromId (id: Identifier): number {
    return this.doc.searchPos(id, new Array())
  }

  setTitle (title: string): void {
    // log.debug('Sending title: ' + title)
    // this.network.sendDocTitle(title)
  }
}
