import { Observable, Subject, Subscription } from 'rxjs'
import {
  LogootSAdd,
  LogootSDel,
  LogootSRopes,
  Identifier,
  TextInsert,
  TextDelete
} from 'mute-structs'

import { JoinEvent } from '../network/'

export class DocService {

  private disposeSubject: Subject<void>

  private doc: LogootSRopes
  private docID: string

  private docDigestSubject: Subject<number>
  private docValueSubject: Subject<string>
  private localLogootSOperationSubject: Subject<LogootSAdd | LogootSDel>
  private remoteTextOperationsSubject: Subject<(TextInsert | TextDelete)[]>

  private localOperationsSubscription: Subscription
  private remoteLogootSOperationsSubscription: Subscription

  constructor (id: number) {
    this.doc = new LogootSRopes(id)

    this.disposeSubject = new Subject<void>()
    this.docDigestSubject = new Subject()
    this.docValueSubject = new Subject()
    this.localLogootSOperationSubject = new Subject()
    this.remoteTextOperationsSubject = new Subject()
  }

  set initSource (source: Observable<string>) {
    source
      .takeUntil(this.disposeSubject)
      .subscribe( (key: string) => {
        this.docID = key
        this.docValueSubject.next(this.doc.str)
      })
  }

  set localTextOperationsSource (source: Observable<(TextDelete | TextInsert)[][]>) {
    this.localOperationsSubscription = source.subscribe((textOperations: (TextDelete | TextInsert)[][]) => {
      this.handleTextOperations(textOperations)
    })

    source
      .takeUntil(this.disposeSubject)
      .debounceTime(1000)
      .subscribe(() => {
        this.docDigestSubject.next(this.doc.digest())
      })
  }

  set remoteLogootSOperationSource (source: Observable<(LogootSAdd | LogootSDel)[]>) {
    this.remoteLogootSOperationsSubscription = source.subscribe((logootSOps: (LogootSAdd | LogootSDel)[]) => {
      const remoteTextOps: (TextInsert | TextDelete)[] =
        logootSOps
          .map((logootSOp: LogootSAdd | LogootSDel) => {
            return this.handleRemoteOperation(logootSOp)
          })
          .reduce((acc: (TextInsert | TextDelete)[], textOps: (TextInsert | TextDelete)[]) => {
            return acc.concat(textOps)
          }, [])
      this.remoteTextOperationsSubject.next(remoteTextOps)
    })

    source
      .takeUntil(this.disposeSubject)
      .debounceTime(1000)
      .subscribe(() => {
        this.docDigestSubject.next(this.doc.digest())
      })
  }

  get onDocDigest (): Observable<number> {
    return this.docDigestSubject.asObservable()
  }

  get onDocValue (): Observable<string> {
    return this.docValueSubject.asObservable()
  }

  get onLocalLogootSOperation (): Observable<LogootSAdd | LogootSDel> {
    return this.localLogootSOperationSubject.asObservable()
  }

  get onRemoteTextOperations (): Observable<TextInsert[] | TextDelete[]> {
    return this.remoteTextOperationsSubject.asObservable()
  }

  clean (): void {
    this.disposeSubject.complete()
    this.docValueSubject.complete()
    this.localLogootSOperationSubject.complete()
    this.remoteTextOperationsSubject.complete()

    this.localOperationsSubscription.unsubscribe()
    this.remoteLogootSOperationsSubscription.unsubscribe()
  }

  handleTextOperations (array: any[][]): void {
    array.forEach( (textOperations: any[]) => {
      textOperations.forEach( (textOperation: any) => {
        const logootSOperation: LogootSAdd | LogootSDel = textOperation.applyTo(this.doc)
        this.localLogootSOperationSubject.next(logootSOperation)
      })
    })
    // log.info('operation:doc', 'updated doc: ', this.doc)
  }

  handleRemoteOperation (logootSOperation: LogootSAdd | LogootSDel): (TextInsert | TextDelete)[] {
    const textOperations: TextInsert[] | TextDelete[] = logootSOperation.execute(this.doc)
    // log.info('operation:doc', 'updated doc: ', this.doc)
    return textOperations
  }

  idFromIndex (index: number): {index: number, last: number, base: number[]} | null {
    let respIntnode = this.doc.searchNode(index)
    if (respIntnode !== null) {
      return {
        index: respIntnode.i,
        last: respIntnode.node.offset + respIntnode.i,
        base: respIntnode.node.block.id.base
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
