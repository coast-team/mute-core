export enum Streams {
  COLLABORATORS = 400,
  METADATA,
  DOCUMENT_CONTENT,
  CURSOR,
}

export enum StreamsSubtype {
  COLLABORATORS_JOIN = 100,
  COLLABORATORS_LOCAL_UPDATE,
  COLLABORATORS_SWIM,
  DOCUMENT_OPERATION,
  DOCUMENT_QUERY,
  DOCUMENT_REPLY,
  METADATA_TITLE,
  METADATA_FIXDATA,
  METADATA_LOGS,
  METADATA_PULSAR,
  CRYPTO,
  CURSOR,
}

export interface StreamId {
  type: Streams
  subtype: StreamsSubtype
}
