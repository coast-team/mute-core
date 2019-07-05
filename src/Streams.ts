export enum Streams {
  COLLABORATORS = 400,
  METADATA,
  DOCUMENT_CONTENT,
}

export enum StreamsSubtype {
  COLLABORATORS_JOIN = 100,
  COLLABORATORS_LOCAL_UPDATE,
  DOCUMENT_OPERATION,
  DOCUMENT_QUERY,
  DOCUMENT_REPLY,
  METADATA_TITLE,
  METADATA_FIXDATA,
  METADATA_LOGS,
}

export interface StreamId {
  type: Streams
  subtype: StreamsSubtype
}
