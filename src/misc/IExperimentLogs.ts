export interface IExperimentLogs {
  type: string
  site: number
  localOperation: any
  operation: any
  vector: Array<[number, number]>
  time1: [number, number]
  time2: [number, number]
  time3: [number, number]
  time4: [number, number]
  struct: any
}

export interface IExperimentLogsSyncMessage {
  type: string
  operation: any
  time1: [number, number]
  time2: [number, number]
}

export interface IExperimentLogsDocument {
  type: string
  localOperation: any
  operation: any
  time3: [number, number]
  time4: [number, number]
  struct: any
}

export interface IExperimentLogsSync {
  type: string
  vector: Array<[number, number]>
  operation: any
}
