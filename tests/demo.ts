import { measureCode } from '../dist'

async function main() {
  const res = await measureCode(
    'demo.ts',
    /*ts*/ `
    import { add } from './math'
    console.log(add(1, 2))  
  `
  )
}
