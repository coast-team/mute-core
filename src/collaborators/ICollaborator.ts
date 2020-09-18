export interface ICollaborator {
  id: number
  muteCoreId?: number
  displayName?: string
  login?: string
  email?: string
  avatar?: string
  deviceID?: string
}

// - - -
export type ISwim =
  | ISwimPing
  | ISwimPingReq
  | ISwimAck
  | ISwimDataRequest
  | ISwimDataUpdate
  | ISwimPingReqRep

export const TYPE_PING_LABEL = 'swimPing'
export interface ISwimPing {
  type: typeof TYPE_PING_LABEL
  piggyback: Map<number, ISwimPG>
}

export const TYPE_PINGREQ_LABEL = 'swimPingReq'
export interface ISwimPingReq {
  type: typeof TYPE_PINGREQ_LABEL
  numTarget: number
  piggyback: Map<number, ISwimPG>
}

export const TYPE_ACK_LABEL = 'swimAck'
export interface ISwimAck {
  type: typeof TYPE_ACK_LABEL
  piggyback: Map<number, ISwimPG>
}

export const TYPE_DATAREQUEST_LABEL = 'swimDataRequest'
export interface ISwimDataRequest {
  type: typeof TYPE_DATAREQUEST_LABEL
  collab: ICollaborator
}

export const TYPE_DATAUPDATE_LABEL = 'swimDataUpdate'
export interface ISwimDataUpdate {
  type: typeof TYPE_DATAUPDATE_LABEL
  PG: Map<number, ISwimPG>
  compteurPG: Map<number, number>
}

export const TYPE_PINGREQREP_LABEL = 'swimPingReqRep'
export interface ISwimPingReqRep {
  type: typeof TYPE_PINGREQREP_LABEL
  answer: boolean
  piggyback: Map<number, ISwimPG>
}

// - - -

export interface ISwimPG {
  collab: ICollaborator
  message: EnumNumPG
  incarn: number
}

enum EnumNumPG {
  Joined = 1,
  Alive = 2,
  Suspect = 3,
  Confirm = 4,
}

export interface ISwimMessage {
  idCollab: number
  content: ISwim
}
