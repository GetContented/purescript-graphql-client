import { deepStrictEqual } from 'assert'
import execSh from 'exec-sh';
const {promise: exec} = execSh;

const logs = []

console.log = (log) => {
  console.info(log)
  logs.push(log)
}

import serverFn from './server-fn.js'
import gps from './generate-purs-schema.mjs'
serverFn(async () => {
  try {
    await gps()
    await exec('npm run build', { stdio: 'pipe', stderr: 'pipe' })
    require('./output/Main').main()
    setTimeout(() => {
      console.info('logs', logs)
      deepStrictEqual(logs, ['[RED]', '1', '[GREEN]', '[GREEN]'])
      console.info('tests passed')
      process.exit(0)
    }, 400)
  } catch (err) {
    console.error('test error', err)
    process.exit(1)
  }
})

setTimeout(() => {
  console.error('Timeout')
  process.exit(1)
}, 60000)
