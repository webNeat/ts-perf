export function test(name: string, fn: () => any) {
  try {
    fn()
    console.log(`✅`, name)
  } catch (err) {
    console.error(`❌`, name)
    console.error(err)
    process.exit(1)
  }
}
