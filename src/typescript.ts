import { normalize } from 'path'
import * as ts from 'typescript'

export function createProgramAndSourceFile(filePath: string, content: string) {
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.ES2015, true)
  const host = addSourceFileToHost(ts.createCompilerHost({}), filePath, sourceFile)
  const program = ts.createProgram([filePath], { noEmitOnError: true }, host)
  return [program, sourceFile] as const
}

export function check(program: ts.Program, sourceFile: ts.SourceFile) {
  return ts.getPreEmitDiagnostics(program, sourceFile)
}

export function formatErrors(diagnostics: readonly ts.Diagnostic[]) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: normalize,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine,
  })
}

function addSourceFileToHost(host: ts.CompilerHost, path: string, sourceFile: ts.SourceFile) {
  const getSourceFile = host.getSourceFile
  host.getSourceFile = (filename, languageVersion) => {
    if (filename === path) return sourceFile
    return getSourceFile(filename, languageVersion)
  }
  return host
}
