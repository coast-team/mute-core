import {
  Identifier,
  LogootSOperation,
  LogootSRopes,
  TextOperation,
} from 'mute-structs'
import { Observable } from 'rxjs/Observable'
import { debounceTime, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs/Subject'

import { Disposable } from '../Disposable'
import { JoinEvent } from '../network/'

export interface Position {
  id: Identifier
  index: number
}

export class DocService implements Disposable {

  private disposeSubject: Subject<void>

  private doc: LogootSRopes
  private docID: string

  private docDigestSubject: Subject<number>
  private docTreeSubject: Subject<string>
  private localLogootSOperationSubject: Subject<LogootSOperation>
  private remoteTextOperationsSubject: Subject<TextOperation[]>
  private updateSubject: Subject<void>

  constructor (id: number) {
    this.doc = new LogootSRopes(id)

    this.disposeSubject = new Subject<void>()
    this.docDigestSubject = new Subject()
    this.docTreeSubject = new Subject()
    this.localLogootSOperationSubject = new Subject()
    this.remoteTextOperationsSubject = new Subject()
    this.updateSubject = new Subject()

    this.updateSubject.pipe(
      takeUntil(this.disposeSubject),
      debounceTime(1000),
    )
      .subscribe(() => {
        this.docTreeSubject.next(JSON.stringify(this.doc))
        this.docDigestSubject.next(this.doc.digest())
      })
  }

  set initSource (source: Observable<string>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe( (key: string) => {
        this.docID = key
      })
  }

  set localTextOperationsSource (source: Observable<TextOperation[]>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((textOperations: TextOperation[]) => {
        this.handleTextOperations(textOperations)
        this.updateSubject.next()
      })
  }

  set remoteLogootSOperationSource (source: Observable<LogootSOperation[]>) {
    source.pipe(takeUntil(this.disposeSubject))
      .subscribe((logootSOps: LogootSOperation[]) => {
        const remoteTextOps: TextOperation[] =
          logootSOps
            .map((logootSOp: LogootSOperation) => {
              return this.handleRemoteOperation(logootSOp)
            })
            .reduce((acc: TextOperation[], textOps: TextOperation[]) => {
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

  get onLocalLogootSOperation (): Observable<LogootSOperation> {
    return this.localLogootSOperationSubject.asObservable()
  }

  get onRemoteTextOperations (): Observable<TextOperation[]> {
    return this.remoteTextOperationsSubject.asObservable()
  }

  dispose (): void {
    this.disposeSubject.next()
    this.disposeSubject.complete()
    this.localLogootSOperationSubject.complete()
    this.remoteTextOperationsSubject.complete()
    this.updateSubject.complete()
  }

  handleTextOperations (textOperations: TextOperation[]): void {
    textOperations.forEach( (textOperation: TextOperation) => {
      const logootSOperation: LogootSOperation = textOperation.applyTo(this.doc)
      this.localLogootSOperationSubject.next(logootSOperation)
    })
    // log.info('operation:doc', 'updated doc: ', this.doc)
  }

  handleRemoteOperation (logootSOperation: LogootSOperation): TextOperation[] {
    const textOperations: TextOperation[] = logootSOperation.execute(this.doc)
    // log.info('operation:doc', 'updated doc: ', this.doc)
    return textOperations
  }

  positionFromIndex (index: number): Position | null {
    const respIntnode = this.doc.searchNode(index)
    if (respIntnode !== null) {
      const offset = respIntnode.node.actualBegin + respIntnode.i
      const id = Identifier.fromBase(respIntnode.node.getIdBegin(), offset)
      return {
        id,
        index: respIntnode.i,
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
