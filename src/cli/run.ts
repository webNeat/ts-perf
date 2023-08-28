import path from 'path'
import { Result } from '../types'

const scriptPath = path.join(__dirname, 'script.js')

export async function run(filePath: string, code: string): Promise<Result> {
  const { execa } = await import('execa')
  try {
    const res = await execa('node', [scriptPath, filePath], {
      input: code,
    })
    if (res.exitCode) {
      return { success: false, errors: res.stderr }
    }
    return JSON.parse(res.stdout)
  } catch (err: any) {
    return { success: false, errors: err.message }
  }
}
