export const isBrowser = typeof window !== 'undefined' ? true : false

export function generateId(): number {
  if (isBrowser) {
    return window.crypto.getRandomValues(new Int32Array(1))[0]
  } else {
    return require('crypto')
      .randomBytes(4)
      .readInt32BE(0, true)
  }
}
