import { Observable, Subject } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { Disposable } from '../Disposable'
import { BroadcastMessage, NetworkMessage, SendRandomlyMessage, SendToMessage } from '../network'
import { metadata as proto } from '../proto'
import { FixDataService, FixDataState } from './FixDataService'
import { TitleService, TitleState } from './TitleService'

export enum MetaDataType {
  Title,
  FixData,
}

export type MetaDataState = TitleState | FixDataState

export interface MetaDataMessage {
  type: MetaDataType
  data: MetaDataState
}

export class MetaDataService implements Disposable {
  public static ID: number = 430

  static mergeTitle(s1: TitleState, s2: TitleState): TitleState {
    return TitleService.merge(s1, s2)
  }

  static mergeFixData(s1: FixDataState, s2: FixDataState): FixDataState {
    return FixDataService.merge(s1, s2)
  }

  private titleService: TitleService
  private fixDataService: FixDataService

  private disposeSubject: Subject<void>
  private localChangeSubject: Subject<MetaDataMessage>
  private remoteChangeSubject: Subject<MetaDataMessage>

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>

  constructor(id: number, titleState: TitleState, fixDataState: FixDataState) {
    this.titleService = new TitleService(titleState)
    this.fixDataService = new FixDataService(fixDataState)

    this.disposeSubject = new Subject()
    this.localChangeSubject = new Subject()
    this.remoteChangeSubject = new Subject()

    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
  }

  set messageSource(source: Observable<NetworkMessage>) {
    source
      .pipe(
        takeUntil(this.disposeSubject),
        filter((msg) => msg.service === MetaDataService.ID)
      )
      .subscribe(({ content }) => {
        const message = Object.assign({}, proto.MetaData.decode(content))
        const type = message.type
        const data = JSON.parse(message.data)
        switch (type) {
          case MetaDataType.Title:
            this.remoteChangeSubject.next({
              type: MetaDataType.Title,
              data: this.titleService.handleRemoteState(data),
            })
            break
          case MetaDataType.FixData:
            this.remoteChangeSubject.next({
              type: MetaDataType.FixData,
              data: this.fixDataService.handleRemoteFixDataState(data),
            })
            break
          default:
            console.error('No MetaDataType for type ' + type)
        }
      })
  }

  set onLocalChange(source: Observable<MetaDataMessage>) {
    source.pipe(takeUntil(this.disposeSubject)).subscribe(({ type, data }) => {
      switch (type) {
        case MetaDataType.Title:
          const { title, titleModified } = data as TitleState
          this.titleService.handleLocalState({ title, titleModified })
          this.emitMetaData(MetaDataType.Title, JSON.stringify(this.titleService.state))
          break
        case MetaDataType.FixData:
          break
        default:
          console.error('No MetaDataType for type ' + type)
      }
    })
  }

  set joinSource(source: Observable<number>) {
    source.pipe(takeUntil(this.disposeSubject)).subscribe((id: number) => this.emitAll(id))
  }

  get onChange(): Observable<MetaDataMessage> {
    return this.remoteChangeSubject.asObservable()
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

  dispose(): void {
    this.disposeSubject.next()
    this.disposeSubject.complete()
    this.localChangeSubject.complete()
    this.remoteChangeSubject.complete()
  }

  private emitAll(id: number) {
    this.emitMetaData(MetaDataType.FixData, JSON.stringify(this.fixDataService.state), id)
    this.emitMetaData(MetaDataType.Title, JSON.stringify(this.titleService.state), id)
  }

  private emitMetaData(type: MetaDataType, data: string, id?: number): void {
    const metaDataMsg = proto.MetaData.create({ type, data })
    if (id) {
      const msg: SendToMessage = new SendToMessage(
        MetaDataService.ID,
        id,
        proto.MetaData.encode(metaDataMsg).finish()
      )
      this.msgToSendToSubject.next(msg)
    } else {
      const msg: BroadcastMessage = new BroadcastMessage(
        MetaDataService.ID,
        proto.MetaData.encode(metaDataMsg).finish()
      )
      this.msgToBroadcastSubject.next(msg)
    }
  }
}
