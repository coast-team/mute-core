import * as CRDT from 'delta-crdts'
import { Observable, Subject } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { Disposable } from '../Disposable'
import { BroadcastMessage, NetworkMessage, SendRandomlyMessage, SendToMessage } from '../network'
import { title as proto } from '../proto'

export interface TitleState {
  count: number
  title: string
}

export class TitleService implements Disposable {
  public static ID: number = 425

  private titleState: TitleState
  private register: any

  private disposeSubject: Subject<void>
  private localTitleStateSubject: Subject<TitleState>
  private remoteTitleSubject: Subject<string>

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>

  constructor(id: number) {
    this.register = CRDT('lwwreg')(id)
    this.titleState = this.register.state()

    this.disposeSubject = new Subject<void>()
    this.localTitleStateSubject = new Subject()
    this.remoteTitleSubject = new Subject()

    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
  }

  public handleLocalTitleState(newState: TitleState): void {
    this.titleState = this.register.write(newState.count, newState.title)
    this.localTitleStateSubject.next(this.titleState)
  }

  public handleRemoteTitleState(newState: TitleState): void {
    this.register.apply([newState.count, newState.title])
    this.titleState = this.register.state()
    this.remoteTitleSubject.next(this.titleState[1])
  }

  public initTitle(init: string): void {
    this.titleState[1] = init
  }

  set onLocalTitleChange(source: Observable<string>) {
    source.pipe(takeUntil(this.disposeSubject)).subscribe((title) => {
      this.handleLocalTitleState({ count: this.titleState[0] + 1, title })
      this.emitTitle()
    })
  }

  set joinSource(source: Observable<number>) {
    source.pipe(takeUntil(this.disposeSubject)).subscribe((id: number) => this.emitTitle(id))
  }

  set messageSource(source: Observable<NetworkMessage>) {
    source
      .pipe(
        takeUntil(this.disposeSubject),
        filter((msg: NetworkMessage) => msg.service === TitleService.ID)
      )
      .subscribe((msg: NetworkMessage) => {
        const titleUpdate = Object.assign({}, proto.Title.decode(msg.content))
        this.handleRemoteTitleState(titleUpdate)
      })
  }

  get onMsgToBroadcast(): Observable<BroadcastMessage> {
    return this.msgToBroadcastSubject.asObservable()
  }

  get onMsgToSendRandomly(): Observable<SendRandomlyMessage> {
    return this.msgToSendRandomlySubject.asObservable()
  }

  get onMsgToSendTo(): Observable<SendToMessage> {
    return this.msgToSendToSubject.asObservable()
  }

  get onRemoteTitleState(): Observable<string> {
    return this.remoteTitleSubject.asObservable()
  }

  get state(): TitleState {
    return this.titleState
  }

  dispose(): void {
    this.disposeSubject.next()
    this.disposeSubject.complete()
    this.localTitleStateSubject.complete()
    this.remoteTitleSubject.complete()
    this.msgToBroadcastSubject.complete()
    this.msgToSendRandomlySubject.complete()
    this.msgToSendToSubject.complete()
  }

  private emitTitle(id?: number): void {
    const state = { count: this.titleState[0], title: this.titleState[1] }
    const titleMsg = proto.Title.create(state)
    if (id) {
      const msg: SendToMessage = new SendToMessage(
        TitleService.ID,
        id,
        proto.Title.encode(titleMsg).finish()
      )
      this.msgToSendToSubject.next(msg)
    } else {
      const msg: BroadcastMessage = new BroadcastMessage(
        TitleService.ID,
        proto.Title.encode(titleMsg).finish()
      )
      this.msgToBroadcastSubject.next(msg)
    }
  }
}
