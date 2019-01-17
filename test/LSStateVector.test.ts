import test, { ExecutionContext } from 'ava'

import { Interval, StateVector, StateVectorOrder } from '../src/core'
import { generateVector } from './LSHelpers'

function isAlreadyDeliveredMacro(
  t: ExecutionContext,
  vector: StateVector,
  key: number,
  value: number,
  expected: boolean
) {
  t.is(vector.isAlreadyDelivered(key, value), expected)
}

function isDeliverableMacro(
  t: ExecutionContext,
  vector: StateVector,
  key: number,
  value: number,
  expected: boolean
) {
  t.is(vector.isDeliverable(key, value), expected)
}

function computeMissingIntervalsMacro(
  t: ExecutionContext,
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

test('compareTo-equal', (t) => {
  const s1 = new StateVector(new Map([[1, 10], [2, 3]]))
  const s2 = new StateVector(new Map([[1, 10], [2, 3]]))
  t.is(s1.compareTo(s2), StateVectorOrder.EQUAL)
})

test('compareTo-inferiorClock', (t) => {
  const s1 = new StateVector(new Map([[1, 10], [2, 1]]))
  const s2 = new StateVector(new Map([[1, 10], [2, 3]]))
  t.is(s1.compareTo(s2), StateVectorOrder.INFERIOR)
})

test('compareTo-inferior', (t) => {
  const s1 = new StateVector(new Map([[1, 10]]))
  const s2 = new StateVector(new Map([[1, 10], [2, 3]]))
  t.is(s1.compareTo(s2), StateVectorOrder.INFERIOR)
})

test('compareTo-superiorClock', (t) => {
  const s1 = new StateVector(new Map([[1, 11], [2, 7]]))
  const s2 = new StateVector(new Map([[1, 10], [2, 3]]))
  t.is(s1.compareTo(s2), StateVectorOrder.SUPERIOR)
})

test('compareTo-superior', (t) => {
  const s1 = new StateVector(new Map([[1, 11], [2, 7], [3, 1]]))
  const s2 = new StateVector(new Map([[1, 10], [2, 3]]))
  t.is(s1.compareTo(s2), StateVectorOrder.SUPERIOR)
})

test('compareTo-concurrentClockSameSize', (t) => {
  const s1 = new StateVector(new Map([[1, 9], [2, 7]]))
  const s2 = new StateVector(new Map([[1, 10], [2, 3]]))
  t.is(s1.compareTo(s2), StateVectorOrder.CONCURRENT)
})

test('compareTo-concurrentDifferentIdSameSize', (t) => {
  const s1 = new StateVector(new Map([[1, 10], [2, 7]]))
  const s2 = new StateVector(new Map([[1, 10], [3, 3]]))
  t.is(s1.compareTo(s2), StateVectorOrder.CONCURRENT)
})

test('compareTo-concurrentDifferentSize', (t) => {
  const s1 = new StateVector(new Map([[1, 10], [2, 7]]))
  const s2 = new StateVector(new Map([[1, 10], [2, 6], [3, 3]]))
  t.is(s1.compareTo(s2), StateVectorOrder.CONCURRENT)
})

test('compareTo-inferior id = 0', (t) => {
  const s1 = new StateVector(new Map([[-90441190, 0], [1852420671, 0]]))
  const s2 = new StateVector(new Map([[-90441190, 0], [1852420671, 0], [1488605160, 0]]))
  t.is(s1.compareTo(s2), StateVectorOrder.INFERIOR)
})

test('compareTo-superior id = 0', (t) => {
  const s1 = new StateVector(new Map([[-90441190, 0], [1852420671, 0], [1488605160, 0]]))
  const s2 = new StateVector(new Map([[-90441190, 0], [1852420671, 0]]))
  t.is(s1.compareTo(s2), StateVectorOrder.SUPERIOR)
})

test('compareTo-equal id = 0', (t) => {
  const s1 = new StateVector(new Map([[-90441190, 0], [1852420671, 0], [1488605160, 0]]))
  const s2 = new StateVector(new Map([[-90441190, 0], [1852420671, 0], [1488605160, 0]]))
  t.is(s1.compareTo(s2), StateVectorOrder.EQUAL)
})

test('compareTo-concurrent id = 0', (t) => {
  const s1 = new StateVector(new Map([[-90441190, 0], [1852420671, 0], [63254125, 0]]))
  const s2 = new StateVector(new Map([[-90441190, 0], [1852420671, 0], [1488605160, 0]]))
  t.is(s1.compareTo(s2), StateVectorOrder.CONCURRENT)
})

test('maxPairwise', (t) => {
  const s1 = new StateVector(new Map([[1, 10], [2, 7], [4, 65]]))
  const s2 = new StateVector(new Map([[1, 10], [2, 6], [3, 3]]))

  const expected = new StateVector(new Map([[1, 10], [2, 7], [3, 3], [4, 65]]))
  s1.maxPairwise(s2)

  t.is(s1.size, expected.size)
  s1.forEach((_clock, id) => {
    t.is(s1.get(id), expected.get(id))
  })
})
