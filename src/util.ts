export const isBrowser = typeof window !== 'undefined' ? true : false

export function generateId(): number {
  if (isBrowser) {
    return global.crypto.getRandomValues(new Int32Array(1))[0]
  } else {
    return global.cryptoNode.randomBytes(4).readInt32BE(0, true)
  }
}
