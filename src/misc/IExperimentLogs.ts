import { StateVector } from '../core'

export interface IExperimentLogs {
  type: string
  site: number
  operation: any
  vector: Array<[number, number]>
  time1: [number, number]
  time2: [number, number]
  time3: [number, number]
  time4: [number, number]
  stats: any
}

export interface IExperimentLogsSyncMessage {
  type: string
  operation: any
  time1: [number, number]
  time2: [number, number]
}

export interface IExperimentLogsDocument {
  type: string
  operation: any
  time3: [number, number]
  time4: [number, number]
  stats: any
}

export interface IExperimentLogsSync {
  type: string
  vector: Array<[number, number]>
  operation: any
}
