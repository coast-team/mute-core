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

  private doc: LogootSRopes
  private docID: string

  private docValueSubject: Subject<string>
  private localLogootSOperationSubject: Subject<LogootSAdd | LogootSDel>
  private remoteTextOperationsSubject: Subject<TextInsert[] | TextDelete[]>

  private joinSubscription: Subscription
  private localOperationsSubscription: Subscription
  private remoteLogootSOperationsSubscription: Subscription

  constructor () {
    this.doc = new LogootSRopes()

    this.docValueSubject = new Subject()
    this.localLogootSOperationSubject = new Subject()
    this.remoteTextOperationsSubject = new Subject()
  }

  set localTextOperationsSource (source: Observable<(TextDelete | TextInsert)[][]>) {
    this.localOperationsSubscription = source.subscribe((textOperations: (TextDelete | TextInsert)[][]) => {
      this.handleTextOperations(textOperations)
    })
  }

  set remoteLogootSOperationSource (source: Observable<LogootSAdd | LogootSDel>) {
    this.remoteLogootSOperationsSubscription = source.subscribe((logootSOp: LogootSAdd | LogootSDel) => {
      this.remoteTextOperationsSubject.next(this.handleRemoteOperation(logootSOp))
    })
  }

  set joinSource (source: Observable<JoinEvent>) {
    this.joinSubscription = source.subscribe( (joinEvent: JoinEvent) => {
      this.docID = joinEvent.key
      this.doc = new LogootSRopes(joinEvent.id)

      this.docValueSubject.next(this.doc.str)
    })
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
    this.docValueSubject.complete()
    this.localLogootSOperationSubject.complete()
    this.remoteTextOperationsSubject.complete()

    this.joinSubscription.unsubscribe()
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

  handleRemoteOperation (logootSOperation: LogootSAdd | LogootSDel): TextInsert[] | TextDelete[] {
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
