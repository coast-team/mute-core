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
  numEnvoi: number
  piggyback: Array<[number, ISwimPG]>
}

export const TYPE_PINGREQ_LABEL = 'swimPingReq'
export interface ISwimPingReq {
  type: typeof TYPE_PINGREQ_LABEL
  numEnvoi: number
  numCible: number
  piggyback: Array<[number, ISwimPG]>
}

export const TYPE_ACK_LABEL = 'swimAck'
export interface ISwimAck {
  type: typeof TYPE_ACK_LABEL
  numEnvoi: number
  piggyback: Array<[number, ISwimPG]>
}

export const TYPE_DATAREQUEST_LABEL = 'swimDataRequest'
export interface ISwimDataRequest {
  type: typeof TYPE_DATAREQUEST_LABEL
  collab: ICollaborator
}

export const TYPE_DATAUPDATE_LABEL = 'swimDataUpdate'
export interface ISwimDataUpdate {
  type: typeof TYPE_DATAUPDATE_LABEL
  numEnvoi: number
  collaborateurs: Map<number, ICollaborator>
  PG: Array<[number, ISwimPG]>
  compteurPG: Array<[number, number]>
}

export const TYPE_PINGREQREP_LABEL = 'swimPingReqRep'
export interface ISwimPingReqRep {
  type: typeof TYPE_PINGREQREP_LABEL
  numEnvoi: number
  reponse: boolean
  piggyback: Array<[number, ISwimPG]>
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
