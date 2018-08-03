/// <reference types="node" />
import * as crypto from 'crypto'
import { env } from './util'

try {
  env.crypto = crypto
} catch (err) {
  console.error(err.message)
}

export * from '.'
