declare var global: Window & {
  crypto: Crypto
  cryptoNode: any
}

declare var require: (id: string) => any
