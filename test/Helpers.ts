import {Disposable} from "../src/Disposable"
import {StateVector} from "../src/sync"

export function disposeOf (disposable: Disposable, time: number): void {
    setTimeout(() => {
        disposable.dispose()
    }, time)
}

export function generateVector (): StateVector {
    const vector: Map<number, number> = new Map()
    vector.set(0, 42)
    vector.set(1, 10)
    vector.set(53, 1)

    return new StateVector(vector)
}
