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

export const TYPE_PING_LABEL = 'ping'
export interface ISwimPing {
  type: typeof TYPE_PING_LABEL
  numEnvoi: number
  piggyback: Array<[number, ISwimMessPG]>
}

export const TYPE_PINGREQ_LABEL = 'pingreq'
export interface ISwimPingReq {
  type: typeof TYPE_PINGREQ_LABEL
  numEnvoi: number
  numCible: number
  piggyback: Array<[number, ISwimMessPG]>
}

export const TYPE_ACK_LABEL = 'ack'
export interface ISwimAck {
  type: typeof TYPE_ACK_LABEL
  numEnvoi: number
  piggyback: Array<[number, ISwimMessPG]>
}

export const TYPE_DATAREQUEST_LABEL = 'datarequest'
export interface ISwimDataRequest {
  type: typeof TYPE_DATAREQUEST_LABEL
  numEnvoi: number
}

export const TYPE_DATAUPDATE_LABEL = 'dataupdate'
export interface ISwimDataUpdate {
  type: typeof TYPE_DATAUPDATE_LABEL
  numEnvoi: number
  collaborateurs: Map<number, ICollaborator>
  PG: Array<[number, ISwimMessPG]>
  compteurPG: Array<[number, number]>
}

export const TYPE_PINGREQREP_LABEL = 'pingreqrep'
export interface ISwimPingReqRep {
  type: typeof TYPE_PINGREQREP_LABEL
  numEnvoi: number
  reponse: boolean
  piggyback: Array<[number, ISwimMessPG]>
}

// - - -

export const TYPE_MESSPG_LABEL = 'MessPG'
export interface ISwimMessPG {
  type: typeof TYPE_MESSPG_LABEL
  message: EnumNumPG
  incarn: number
}

enum EnumNumPG {
  Joined = 1,
  Alive = 2,
  Suspect = 3,
  Confirm = 4,
}
