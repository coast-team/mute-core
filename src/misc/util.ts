/// <reference types="node" />
import * as CryptoNode from 'crypto'

export interface IEnvironment {
  crypto: Crypto | typeof CryptoNode
}

export const env = {} as IEnvironment

export function generateId(): number {
  if ('getRandomValues' in env.crypto) {
    const bytes = env.crypto.getRandomValues(new Int32Array(1)) as Int32Array
    return bytes[0]
  } else {
    return env.crypto.randomBytes(4).readInt32BE(0, true)
  }
}
