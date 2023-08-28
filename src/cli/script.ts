import { existsSync } from 'fs'
import { readFile } from 'fs/promises'
import * as ts from '../typescript'
import { Result } from '../types'

async function main() {
  const filePath = process.argv[2]
  const code = existsSync(filePath) ? await readFile(filePath, 'utf-8') : await stdin()
  const [program, sourceFile] = ts.createProgramAndSourceFile(filePath, code)
  const start = performance.now()
  const diagnostics = ts.check(program, sourceFile)
  const duration = performance.now() - start

  let res: Result
  if (diagnostics.length) {
    res = { success: false, errors: ts.formatErrors(diagnostics) }
  } else {
    res = { success: true, duration }
  }
  console.log(JSON.stringify(res))
}

main().catch((err) => {
  console.log(JSON.stringify({ success: false, errors: `${err}` }))
})

async function stdin() {
  let content = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) {
    content += chunk
  }
  return content
}
