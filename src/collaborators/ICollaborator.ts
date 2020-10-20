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
  incarn : number
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

export enum EnumNumPG {
  Alive = 2,
  Suspect = 3,
  Dead = 4,
}

export interface ISwimMessage {
  idCollab: number  // Id du collaborateur qui a envoyé le message ou de celui a qui on veut envoyer un message
  content: ISwim  // Contenu du message
}