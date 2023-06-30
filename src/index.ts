import { Project } from 'ts-morph';

export async function measure(path: string) {
  const project = new Project();
  const file = project.addSourceFileAtPath(path)
  const start = performance.now()
  const diagnostics = file.getPreEmitDiagnostics()
  const duration = performance.now() - start
  const error = project.formatDiagnosticsWithColorAndContext(diagnostics)
  return [duration, error] as [number, string]
}