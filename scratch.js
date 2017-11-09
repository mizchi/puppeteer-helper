/* @flow */
import path from 'path'
import puppeteer from 'puppeteer'

function delay(n: number) {
  return new Promise(resolve => setTimeout(resolve, n))
}

async function getPerformanceMetrics(page) {
  const { metrics } = await page._client.send('Performance.getMetrics')
  return metrics.reduce((acc, i) => ({ ...acc, [i.name]: i.value }), {})
}

function createScreenshotContext(page) {
  let counter = 0
  return key => {
    const fname = (counter++).toString().padStart(4, '0') + '-' + key
    // console.log('screenshot to', fname)
    return page.screenshot({
      path: `tmp/screenshots/${fname}.png`
    })
  }
}

function report(results) {
  let prev = results.shift()
  let next: any = null

  const targetKeys = Object.keys(prev)
  while ((next = results.shift())) {
    const delta = targetKeys.reduce((acc, key) => {
      const p = prev[key]
      const n = next[key]
      if (p !== n) {
        return { ...acc, [key]: n - p }
      } else {
        return acc
      }
    }, {})
    // console.log('delta >', delta)
    console.log(JSON.stringify(delta, null, 2))
    prev = next
  }
}

async function run() {
  const browser = await puppeteer.launch()
  process.on('exit', async () => {
    await browser.close()
  })
  // setup
  const page = await browser.newPage()
  await page._client.send('Performance.enable')
  const screeshot = createScreenshotContext(page)
  const zero = await getPerformanceMetrics(page)

  // start
  await page.goto(
    'file:///Users/mz/sandbox/puppet-play/simple/public/index.html'
  )
  // await page.waitForNavigation({
  //   waitUntil: 'load'
  // })
  // console.log('waited')
  const rendered = await getPerformanceMetrics(page)
  await screeshot('documentcontentloaded')
  // console.log('init', zero)
  // console.log('rendered', rendered)
  // report([zero, rendered])
  console.log('rendered', rendered)

  await browser.close()
}

run()
