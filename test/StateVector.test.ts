import { AssertionError } from 'assert'
import { AssertContext, test } from 'ava'

import { Interval, StateVector } from '../src/sync'
import { generateVector } from './Helpers'

function isAlreadyDeliveredMacro(
  t: AssertContext,
  vector: StateVector,
  key: number,
  value: number,
  expected: boolean
) {
  t.is(vector.isAlreadyDelivered(key, value), expected)
}

function isDeliverableMacro(
  t: AssertContext,
  vector: StateVector,
  key: number,
  value: number,
  expected: boolean
) {
  t.is(vector.isDeliverable(key, value), expected)
}

function computeMissingIntervalsMacro(
  t: AssertContext,
  vector: StateVector,
  other: StateVector,
  expectedMissingIntervals: Interval[]
) {
  const actualMissingIntervals = vector.computeMissingIntervals(other)
  t.deepEqual(actualMissingIntervals, expectedMissingIntervals)
}

test('constructor-without-parameter', (context) => {
  const vector = new StateVector()
  context.is(vector.size, 0)
})

test('constructor-with-parameter', (context) => {
  const map = new Map([[0, 0], [1, 7], [42, 53]])
  const vector = new StateVector(map)

  context.is(vector.size, map.size)
  map.forEach((expectedValue, key) => {
    context.is(vector.get(key), expectedValue)
  })
})

test('set-adding-new-entry', (context) => {
  const key = 42
  const expectedSize = 1
  const expectedValue = 0
  const vector = new StateVector()

  vector.set(key, expectedValue)
  context.is(vector.size, expectedSize)
  context.is(vector.get(key), expectedValue)
})

test('set-updating-entry', (context) => {
  const vector = generateVector()
  const key = 0
  const expectedSize = vector.size
  const expectedValue = (vector.get(0) as number) + 1

  vector.set(key, expectedValue)

  context.is(vector.size, expectedSize)
  context.is(vector.get(key), expectedValue)
})

test('set-error-missing-values-of-new-entry', (context) => {
  const vector = new StateVector()
  const key = 42
  const expectedSize = 0

  context.throws(() => {
    vector.set(key, 42)
  }, AssertionError)

  context.is(vector.size, expectedSize)
})

test('set-error-replaying-previous-entry', (context) => {
  const vector = generateVector()
  const key = 0
  const currentValue = vector.get(key) as number
  const expectedSize = vector.size

  context.throws(() => {
    vector.set(key, currentValue - 1)
  }, AssertionError)

  context.is(vector.size, expectedSize)
  context.is(vector.get(key), currentValue)
})

test('set-error-replaying-last-entry', (context) => {
  const vector = generateVector()
  const key = 0
  const currentValue = vector.get(key) as number
  const expectedSize = vector.size

  context.throws(() => {
    vector.set(key, currentValue)
  }, AssertionError)

  context.is(vector.size, expectedSize)
  context.is(vector.get(key), currentValue)
})

test('set-error-missing-values-of-known-entry', (context) => {
  const vector = generateVector()
  const key = 0
  const currentValue = vector.get(key) as number
  const expectedSize = vector.size

  context.throws(() => {
    vector.set(key, currentValue + 2)
  }, AssertionError)

  context.is(vector.size, expectedSize)
  context.is(vector.get(key), currentValue)
})

// generateVector() === { 0 -> 42, 1 -> 10, 53 -> 1}
test(
  'isAlreadyDelivered-known-entry-previously-delivered-message',
  isAlreadyDeliveredMacro,
  generateVector(),
  0,
  41,
  true
)
test(
  'isAlreadyDelivered-known-entry-last-message-delivered',
  isAlreadyDeliveredMacro,
  generateVector(),
  0,
  42,
  true
)
test(
  'isAlreadyDelivered-known-entry-message-not-yet-delivered',
  isAlreadyDeliveredMacro,
  generateVector(),
  0,
  43,
  false
)
test('isAlreadyDelivered-new-entry', isAlreadyDeliveredMacro, new StateVector(), 0, 0, false)

test(
  'isDeliverable-known-entry-previously-delivered-message',
  isDeliverableMacro,
  generateVector(),
  0,
  41,
  false
)
test(
  'isDeliverable-known-entry-last-message-delivered',
  isDeliverableMacro,
  generateVector(),
  0,
  42,
  false
)
test(
  'isDeliverable-known-entry-next-message-to-deliver',
  isDeliverableMacro,
  generateVector(),
  0,
  43,
  true
)
test('isDeliverable-known-entry-future-message', isDeliverableMacro, generateVector(), 0, 44, false)
test('isDeliverable-new-entry-first-message', isDeliverableMacro, new StateVector(), 0, 0, true)
test('isDeliverable-new-entry-second-message', isDeliverableMacro, new StateVector(), 0, 1, false)

// defaultVector === generateVector() === { 0 -> 42, 1 -> 10, 53 -> 1}
// emptyVector === new StateVector()
test(
  'computeMissingIntervals-emptyVector-and-emptyVector',
  computeMissingIntervalsMacro,
  new StateVector(),
  new StateVector(),
  []
)
test(
  'computeMissingIntervals-defaultVector-and-emptyVector',
  computeMissingIntervalsMacro,
  generateVector(),
  new StateVector(),
  []
)
test(
  'computeMissingIntervals-emptyVector-and-defaultVector',
  computeMissingIntervalsMacro,
  new StateVector(),
  generateVector(),
  [new Interval(0, 0, 42), new Interval(1, 0, 10), new Interval(53, 0, 1)]
)
test(
  'computeMissingIntervals-defaultVector-and-defaultVector',
  computeMissingIntervalsMacro,
  generateVector(),
  generateVector(),
  []
)

const updatedVector1 = generateVector()
updatedVector1.set(0, 43)
test(
  'computeMissingIntervals-defaultVector-and-updatedVector1',
  computeMissingIntervalsMacro,
  generateVector(),
  updatedVector1,
  [new Interval(0, 43, 43)]
)

const updatedVector2 = generateVector()
updatedVector2.set(5, 0)
test(
  'computeMissingIntervals-defaultVector-and-updatedVector2',
  computeMissingIntervalsMacro,
  generateVector(),
  updatedVector2,
  [new Interval(5, 0, 0)]
)
