import test from 'ava'
import { State } from '../src/sync'

test('isReadonlyArray-ok', (context) => {
  const o = [[1, 2], [3, 4], [5, 6]]
  context.is(State.isArray(o), true)
})

test('isReadonlyArray-not number 1', (context) => {
  const o = [[1, 2], [3, 4], ['test', 6]]
  context.is(State.isArray(o), false)
})

test('isReadonlyArray-not number 2', (context) => {
  const o = [[1, 'plop'], [3, 4], [5, 6]]
  context.is(State.isArray(o), false)
})

test('isReadonlyArray-not array element', (context) => {
  const o = [1, [3, 4], [5, 6]]
  context.is(State.isArray(o), false)
})

test('isReadonlyArray-not array', (context) => {
  const o = 'test'
  const p = 1
  context.is(State.isArray(o), false)
  context.is(State.isArray(p), false)
})
