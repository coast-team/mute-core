import test from 'ava'
import { LSState } from '../src/crdtImpl/LogootSplit'

test('isReadonlyArray-ok', (context) => {
  const o = [[1, 2], [3, 4], [5, 6]]
  context.is(LSState.isArray(o), true)
})

test('isReadonlyArray-not number 1', (context) => {
  const o = [[1, 2], [3, 4], ['test', 6]]
  context.is(LSState.isArray(o), false)
})

test('isReadonlyArray-not number 2', (context) => {
  const o = [[1, 'plop'], [3, 4], [5, 6]]
  context.is(LSState.isArray(o), false)
})

test('isReadonlyArray-not array element', (context) => {
  const o = [1, [3, 4], [5, 6]]
  context.is(LSState.isArray(o), false)
})

test('isReadonlyArray-not array', (context) => {
  const o = 'test'
  const p = 1
  context.is(LSState.isArray(o), false)
  context.is(LSState.isArray(p), false)
})
