import assert from 'assert'
import { test } from './utils'
import { measurePath, measureCode } from '../src'

test('measurePath: empty file', () => {
  const duration = measurePath('tests/empty.ts')
  console.log(duration)
  assert.equal(duration < 500, true)
})

test('measurePath: simple file', () => {
  const duration = measurePath('tests/math.ts')
  console.log(duration)
  assert.equal(duration < 500, true)
})

test('measurePath: file importing other files', () => {
  const duration = measurePath('tests/computation.ts')
  console.log(duration)
  assert.equal(duration < 500, true)
})

test('measurePath: heavy types', () => {
  const duration = measurePath('tests/heavy.ts')
  console.log(duration)
  assert.equal(duration > 300, true)
  assert.equal(duration < 2_000, true)
})

test('measurePath: file with errors', () => {
  assert.throws(() => measurePath('tests/wrong.ts'))
})

test('measureCode: empty code', () => {
  const duration = measureCode(__filename, '')
  console.log(duration)
  assert.equal(duration < 500, true)
})

test('measureCode: simple code', () => {
  const duration = measureCode(
    __filename,
    /*ts*/ `
    export function add(x: number, y: number) {
      return x + y
    }
  `
  )
  console.log(duration)
  assert.equal(duration < 500, true)
})

test('measureCode: file importing other files', () => {
  const duration = measureCode(
    __filename,
    /*ts*/ `
      import { add } from './math'
      console.log(add(1, 2))  
    `
  )
  console.log(duration)
  assert.equal(duration < 500, true)
})

test('measureCode: heavy types', () => {
  const duration = measureCode(
    __filename,
    /*ts*/ `
      import { tuple } from 'just-types'
      const x: tuple.Permutation<[1, 2, 3, 4, 5, 6, 7]> = [1, 4, 7, 2, 6, 3, 5]  
    `
  )
  console.log(duration)
  assert.equal(duration > 300, true)
  assert.equal(duration < 2_000, true)
})

test('measureCode: file with errors', () => {
  assert.throws(() =>
    measureCode(
      __filename,
      /*ts*/ `
        import { add } from './math'
        console.log(add('foo', 2))
      `
    )
  )
})
