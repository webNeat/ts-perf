import { Project, ProjectOptions, SourceFile } from 'ts-morph';

export async function measureCode(code: string, options?: ProjectOptions) {
  const path = addPathSuffix(getCallerFilePath(), '__ts-perf')
  const project = new Project(options)
  const file = project.createSourceFile(path, code)
  return measure(project, file)
}

export async function measurePath(path: string, options?: ProjectOptions) {
  const project = new Project(options)
  const file = project.addSourceFileAtPath(path)
  return measure(project, file)
}

export async function measure(project: Project, file: SourceFile) {
  const start = performance.now()
  const diagnostics = file.getPreEmitDiagnostics()
  const duration = performance.now() - start
  const error = project.formatDiagnosticsWithColorAndContext(diagnostics)
  if (error) throw error
  return duration
}

export function getCallerFilePath() {
  const originalFunc = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };
  const err = new Error();
  Error.captureStackTrace(err, getCallerFilePath);
  const stack = err.stack as any;
  Error.prepareStackTrace = originalFunc;
  return stack[2].getFileName();
}

export function addPathSuffix(path: string, suffix: string) {
  const parts = path.split('.')
  const extension = parts.pop()
  return parts.join('.') + suffix + '.' + extension
}