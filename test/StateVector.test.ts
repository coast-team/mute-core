import test from "ava"

import {StateVector} from "../src/sync"

test("constructor-without-parameter", (t) => {
    const vector = new StateVector()
    t.is(vector.size, 0)
})

test("constructor-with-parameter", (t) => {
    const map = new Map<number, number>()
    map.set(0, 0)
    map.set(1, 7)
    map.set(42, 53)

    const vector = new StateVector(map)
    t.is(vector.size, map.size)
    map.forEach((expectedValue: number, key: number): void => {
        const actualValue: number | undefined = vector.get(key)
        t.is(actualValue, expectedValue)
    })
})

test("set-adding-new-entry", (t) => {
    const key = 42

    const expectedSize = 1
    const expectedValue = 0
    const vector = new StateVector()

    vector.set(key, expectedValue)

    t.is(vector.size, expectedSize)
    t.is(vector.get(key), expectedValue)
})

test("set-updating-entry", (t) => {
    const key = 42
    const currentValue = 5
    const map = new Map<number, number>()
    map.set(key, currentValue)

    const expectedSize = map.size
    const expectedValue = currentValue + 1
    const vector = new StateVector(map)

    vector.set(key, expectedValue)

    t.is(vector.size, expectedSize)
    t.is(vector.get(key), expectedValue)
})

test("set-error-missing-values-of-new-entry", (t) => {
    const vector = new StateVector()
    const key = 42
    const expectedSize = 0

    const error = t.throws(() => {
        vector.set(key, 42)
    }, Error)

    t.is(vector.size, expectedSize)
})

test("set-error-replaying-previous-entry", (t) => {
    const key = 42
    const currentValue = 5
    const map = new Map<number, number>()
    map.set(key, currentValue)

    const expectedSize = map.size
    const vector = new StateVector(map)

    const error = t.throws(() => {
        vector.set(key, currentValue - 1)
    }, Error)

    t.is(vector.size, expectedSize)
    t.is(vector.get(key), currentValue)
})

test("set-error-replaying-last-entry", (t) => {
    const key = 42
    const currentValue = 5
    const map = new Map<number, number>()
    map.set(key, currentValue)

    const expectedSize = map.size
    const vector = new StateVector(map)

    const error = t.throws(() => {
        vector.set(key, currentValue)
    }, Error)

    t.is(vector.size, expectedSize)
    t.is(vector.get(key), currentValue)
})

test("set-error-missing-values-of-known-entry", (t) => {
    const key = 42
    const currentValue = 5
    const map = new Map<number, number>()
    map.set(key, currentValue)

    const expectedSize = map.size
    const vector = new StateVector(map)

    const error = t.throws(() => {
        vector.set(key, currentValue + 2)
    }, Error)

    t.is(vector.size, expectedSize)
    t.is(vector.get(key), currentValue)
})
