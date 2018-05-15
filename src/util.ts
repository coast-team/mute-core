export const isBrowser = typeof window !== 'undefined' ? true : false

export function generateId(): number {
  if (isBrowser) {
    return window.crypto.getRandomValues(new Uint32Array(1))[0]
  } else {
    return require('crypto')
      .randomBytes(4)
      .readUInt32BE(0, true)
  }
}
