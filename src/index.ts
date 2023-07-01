import * as ts from 'typescript'
import { normalize } from 'path'

export function measureCode(path: string, code: string) {
  const sourceFile = ts.createSourceFile(path, code, ts.ScriptTarget.ES2015, true)
  const host = addSourceFileToHost(ts.createCompilerHost({}), path, sourceFile)
  const program = ts.createProgram([path], { noEmitOnError: true }, host)
  return measure(program, sourceFile)
}

export function measurePath(filePath: string) {
  const program = ts.createProgram([filePath], { noEmitOnError: true })
  const sourceFile = program.getSourceFile(filePath)
  if (!sourceFile) {
    throw new Error(`No source file found at path: ${filePath}`)
  }
  return measure(program, sourceFile)
}

function measure(program: ts.Program, sourceFile: ts.SourceFile) {
  const start = performance.now()
  const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile)
  const duration = performance.now() - start
  if (diagnostics.length > 0) {
    const error = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: normalize,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    })
    throw new Error(error)
  }
  return duration
}

function addSourceFileToHost(host: ts.CompilerHost, path: string, sourceFile: ts.SourceFile) {
  const getSourceFile = host.getSourceFile
  host.getSourceFile = (filename, languageVersion) => {
    if (filename === path) return sourceFile
    return getSourceFile(filename, languageVersion)
  }
  return host
}
