import { Observable, Subject } from 'rxjs'

import { IMessageIn, IMessageOut, Service } from '../misc'
import { metadata as proto } from '../proto'
import { Streams } from '../Streams'
import { FixData, FixDataState } from './FixData'
import { Title, TitleState } from './Title'

export enum MetaDataType {
  Title,
  FixData,
}

export type MetaDataState = TitleState | FixDataState

export interface MetaDataMessage {
  type: MetaDataType
  data: MetaDataState
}

export class MetaDataService extends Service<proto.IMetaData, proto.MetaData> {
  static mergeTitle(s1: TitleState, s2: TitleState): TitleState {
    return Title.merge(s1, s2)
  }

  static mergeFixData(s1: FixDataState, s2: FixDataState): FixDataState {
    return FixData.merge(s1, s2)
  }

  private title: Title
  private fixData: FixData

  private localUpdateSubject: Subject<MetaDataMessage>
  private remoteUpdateSubject: Subject<MetaDataMessage>

  constructor(
    messageIn$: Observable<IMessageIn>,
    messageOut$: Subject<IMessageOut>,
    titleState: TitleState,
    fixDataState: FixDataState
  ) {
    super(messageIn$, messageOut$, Streams.METADATA, proto.MetaData)

    this.title = new Title(titleState)
    this.fixData = new FixData(fixDataState)

    this.localUpdateSubject = new Subject()
    this.remoteUpdateSubject = new Subject()

    this.newSub = this.messageIn$.subscribe(({ msg: { type, data } }) => {
      const dataObj = JSON.parse(data)
      switch (type) {
        case MetaDataType.Title:
          this.remoteUpdateSubject.next({
            type: MetaDataType.Title,
            data: this.title.handleRemoteState(dataObj),
          })
          break
        case MetaDataType.FixData:
          this.remoteUpdateSubject.next({
            type: MetaDataType.FixData,
            data: this.fixData.handleRemoteFixDataState(dataObj),
          })
          break
        default:
          console.error('No MetaDataType for type ' + type)
      }
    })
  }

  set localUpdate$(source: Observable<MetaDataMessage>) {
    this.newSub = source.subscribe(({ type, data }) => {
      switch (type) {
        case MetaDataType.Title:
          const { title, titleModified } = data as TitleState
          this.title.handleLocalState({ title, titleModified })
          super.send({ type: MetaDataType.Title, data: JSON.stringify(this.title.state) })
          break
        case MetaDataType.FixData:
          break
        default:
          console.error('No MetaDataType for type ' + type)
      }
    })
  }

  set memberJoin$(source: Observable<number>) {
    this.newSub = source.subscribe((id) => {
      super.send({ type: MetaDataType.FixData, data: JSON.stringify(this.fixData.state) }, id)
      super.send({ type: MetaDataType.Title, data: JSON.stringify(this.title.state) }, id)
    })
  }

  get remoteUpdate$(): Observable<MetaDataMessage> {
    return this.remoteUpdateSubject.asObservable()
  }

  dispose(): void {
    this.localUpdateSubject.complete()
    this.remoteUpdateSubject.complete()
    super.dispose()
  }
}
