import { test } from '@japa/runner'
import { measureCode } from '../dist'

test.group('measureCode', () => {
  test('empty code', async ({ expect }) => {
    const res = (await measureCode('tests/samples/demo.ts', '')) as any
    expect(res.success).toBe(true)
    expect(res.duration).toBeLessThan(500)
  })

  test('simple code', async ({ expect }) => {
    const res = (await measureCode(
      'tests/samples/demo.ts',
      /*ts*/ `
      export function add(x: number, y: number) {
        return x + y
      }
    `
    )) as any
    expect(res.success).toBe(true)
    expect(res.duration).toBeLessThan(500)
  })

  test('file importing other files', async ({ expect }) => {
    const res = (await measureCode(
      'tests/samples/demo.ts',
      /*ts*/ `
        import { add } from './math'
        console.log(add(1, 2))  
      `
    )) as any
    expect(res.success).toBe(true)
    expect(res.duration).toBeLessThan(700)
  })

  test('heavy types', async ({ expect }) => {
    const res = (await measureCode(
      'tests/samples/demo.ts',
      /*ts*/ `
        import { tuple } from 'just-types'
        const x: tuple.Permutation<[1, 2, 3, 4, 5, 6, 7]> = [1, 4, 7, 2, 6, 3, 5]  
      `
    )) as any
    expect(res.success).toBe(true)
    expect(res.duration).toBeGreaterThan(300)
    expect(res.duration).toBeLessThan(3000)
  }).timeout(10_000)

  test('file with errors', async ({ expect }) => {
    const res = (await measureCode(
      'tests/samples/demo.ts',
      /*ts*/ `
      import { add } from './math'
      console.log(add('foo', 2))
    `
    )) as any
    expect(res.success).toBe(false)
    expect(res.errors).toBeTruthy()
  })
})
