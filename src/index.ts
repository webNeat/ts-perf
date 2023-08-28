import { access, constants } from 'fs/promises'
import { run } from './cli'
import { Result } from './types'

export async function measurePath(filePath: string): Promise<Result> {
  try {
    await access(filePath, constants.R_OK)
  } catch {
    return {
      success: false,
      errors: `Could not read file '${filePath}'`,
    }
  }
  return run(filePath, '')
}

export async function measureCode(filePath: string, code: string): Promise<Result> {
  return run(filePath, code)
}
