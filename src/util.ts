export const isBrowser =
  global === undefined || typeof (global as any).window !== 'undefined' ? true : false

export function generateId(): number {
  let res
  if (isBrowser) {
    res = new Uint32Array(1)
    window.crypto.getRandomValues(res)
  } else {
    res = []
    const bytes = require('crypto').randomBytes(4)
    for (let i = 0; i < bytes.length; i += 4) {
      res[res.length] = bytes.readUInt32BE(i, true)
    }
  }
  return res
}
