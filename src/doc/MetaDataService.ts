import { Observable, Subject } from 'rxjs'
import { filter, takeUntil } from 'rxjs/operators'
import { Disposable } from '../Disposable'
import { BroadcastMessage, NetworkMessage, SendRandomlyMessage, SendToMessage } from '../network'
import { metadata as proto } from '../proto'
import { FixDataService, FixDataState } from './FixDataService'
import { TitleService } from './TitleService'

export enum MetaDataType {
  Title,
  FixData,
}

export interface MetaDataMessage {
  type: MetaDataType
  data: any
}

export class MetaDataService implements Disposable {
  public static ID: number = 430

  private titleService: TitleService
  private fixDataService: FixDataService

  private disposeSubject: Subject<void>
  private localChangeSubject: Subject<MetaDataMessage>
  private remoteChangeSubject: Subject<MetaDataMessage>

  private msgToBroadcastSubject: Subject<BroadcastMessage>
  private msgToSendRandomlySubject: Subject<SendRandomlyMessage>
  private msgToSendToSubject: Subject<SendToMessage>

  constructor(id: number) {
    this.titleService = new TitleService(id)
    this.fixDataService = new FixDataService()

    this.disposeSubject = new Subject()
    this.localChangeSubject = new Subject()
    this.remoteChangeSubject = new Subject()

    this.msgToBroadcastSubject = new Subject()
    this.msgToSendRandomlySubject = new Subject()
    this.msgToSendToSubject = new Subject()
  }

  initTitle(title: string, titleLastModification: number) {
    this.titleService.initTitle(title, titleLastModification)
  }

  initFixMetaData(creationDate: Date, key: string) {
    this.fixDataService.init(creationDate, key)
  }

  set messageSource(source: Observable<NetworkMessage>) {
    source
      .pipe(
        takeUntil(this.disposeSubject),
        filter((msg: NetworkMessage) => msg.service === MetaDataService.ID)
      )
      .subscribe((msg: NetworkMessage) => {
        const message = Object.assign({}, proto.MetaData.decode(msg.content))
        const type = message.type
        const data = JSON.parse(message.data)
        switch (type) {
          case MetaDataType.Title:
            this.titleService.handleRemoteTitleState(data)
            this.remoteChangeSubject.next({
              type: MetaDataType.Title,
              data: this.titleService.title,
            })
            break
          case MetaDataType.FixData:
            data.creationDate = new Date(data.creationDate)
            this.fixDataService.handleRemoteFixDataState(data)
            this.remoteChangeSubject.next({
              type: MetaDataType.FixData,
              data: this.fixDataService.state,
            })
            break
          default:
            console.error('No MetaDataType for type ' + type)
        }
      })
  }

  set onLocalChange(source: Observable<MetaDataMessage>) {
    source.pipe(takeUntil(this.disposeSubject)).subscribe((metadata: MetaDataMessage) => {
      switch (metadata.type) {
        case MetaDataType.Title:
          this.titleService.handleLocalTitleState(
            metadata.data.title,
            metadata.data.titleLastModification
          )
          this.emitMetaData(MetaDataType.Title, JSON.stringify(this.titleService.asObject))
          break
        case MetaDataType.FixData:
          break
        default:
          console.error('No MetaDataType for type ' + metadata.type)
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
    this.emitMetaData(MetaDataType.Title, JSON.stringify(this.titleService.asObject), id)
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
