import { Observable, Subject } from 'rxjs'

import { IMessageIn, IMessageOut } from '../network'
import { metadata as proto } from '../proto'
import { Service } from '../Service'
import { Streams } from '../Streams'
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

export class MetaDataService extends Service {
  static mergeTitle(s1: TitleState, s2: TitleState): TitleState {
    return TitleService.merge(s1, s2)
  }

  static mergeFixData(s1: FixDataState, s2: FixDataState): FixDataState {
    return FixDataService.merge(s1, s2)
  }

  private titleService: TitleService
  private fixDataService: FixDataService

  private localChangeSubject: Subject<MetaDataMessage>
  private remoteChangeSubject: Subject<MetaDataMessage>

  constructor(
    messageIn: Observable<IMessageIn>,
    messageOut: Subject<IMessageOut>,
    titleState: TitleState,
    fixDataState: FixDataState
  ) {
    super(messageIn, messageOut, Streams.METADATA)

    this.titleService = new TitleService(titleState)
    this.fixDataService = new FixDataService(fixDataState)

    this.localChangeSubject = new Subject()
    this.remoteChangeSubject = new Subject()

    this.newSub = messageIn.subscribe(({ content }) => {
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
    this.newSub = source.subscribe(({ type, data }) => {
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
    this.newSub = source.subscribe((id: number) => this.emitAll(id))
  }

  get onChange(): Observable<MetaDataMessage> {
    return this.remoteChangeSubject.asObservable()
  }

  dispose(): void {
    this.localChangeSubject.complete()
    this.remoteChangeSubject.complete()
    super.dispose()
  }

  private emitAll(id: number) {
    this.emitMetaData(MetaDataType.FixData, JSON.stringify(this.fixDataService.state), id)
    this.emitMetaData(MetaDataType.Title, JSON.stringify(this.titleService.state), id)
  }

  private emitMetaData(type: MetaDataType, data: string, id?: number): void {
    const metaDataMsg = proto.MetaData.create({ type, data })
    super.send(proto.MetaData.encode(proto.MetaData.create({ type, data })).finish(), id)
  }
}
