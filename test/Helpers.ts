import { Disposable } from "../src/Disposable"

export function disposeOf (disposable: Disposable, time: number): void {
    setTimeout(() => {
        disposable.dispose()
    }, time)
}
