import { test } from '@japa/runner'
import { measurePath } from '../dist'

test.group('measurePath', () => {
  test('empty file', async ({ expect }) => {
    const res = (await measurePath('tests/samples/empty.ts')) as any
    expect(res.success).toBe(true)
    expect(res.duration).toBeLessThan(500)
  })

  test('simple file', async ({ expect }) => {
    const res = (await measurePath('tests/samples/math.ts')) as any
    expect(res.success).toBe(true)
    expect(res.duration).toBeLessThan(500)
  })

  test('file importing other files', async ({ expect }) => {
    const res = (await measurePath('tests/samples/computation.ts')) as any
    expect(res.success).toBe(true)
    expect(res.duration).toBeLessThan(500)
  })

  test('heavy types', async ({ expect }) => {
    const res = (await measurePath('tests/samples/heavy.ts')) as any
    expect(res.success).toBe(true)
    expect(res.duration).toBeGreaterThan(200)
    expect(res.duration).toBeLessThan(3000)
  }).timeout(10_000)

  test('file with errors', async ({ expect }) => {
    const res = (await measurePath('tests/samples/wrong.ts')) as any
    expect(res.success).toBe(false)
    expect(res.errors).toBeTruthy()
  })

  test('missing file', async ({ expect }) => {
    const res = (await measurePath('tests/samples/missing.ts')) as any
    expect(res.success).toBe(false)
    expect(res.errors).toBeTruthy()
  })
})
