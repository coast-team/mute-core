import { Subscription } from 'rxjs'

export abstract class Disposable {
  private subs: Subscription[]

  constructor() {
    this.subs = []
  }

  protected set newSub(sub: Subscription) {
    this.subs[this.subs.length] = sub
  }

  protected dispose() {
    this.subs.forEach((s) => s.unsubscribe())
  }
}
