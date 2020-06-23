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

/* tslint:disable */

export type NonFunctionNames<T> = { [k in keyof T]: T[k] extends Function ? never : k }[keyof T]

export type Unknown<T> = { [k in NonFunctionNames<T>]?: unknown }

/**
 * Example:
 * Given `x: unknown`
 * `isObject<{ p: number }>(x) && typeof x.p === "number"`
 * enables to test if x is conforms to `{ p: number }`.
 *
 * @param x
 * @param Is `x' a non-null object?
 */
export const isObject = <T>(x: unknown): x is Unknown<T> => typeof x === 'object' && x !== null
