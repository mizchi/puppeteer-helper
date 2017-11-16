/* @flow */
import type { Metrics } from './metricsHelpers'
import * as metricsHelpers from './metricsHelpers'

export function delay(n: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, n))
}

export function createScreenshotContext(page: any): string => Promise<void> {
  let counter = 0
  return (key: string = '') => {
    const fname = (counter++).toString().padStart(4, '0') + '-' + key
    console.log('screenshot to', fname)
    return page.screenshot({
      path: `tmp/screenshots/${fname}.png`
    })
  }
}

async function waitForFMP(page: any): Promise<Metrics> {
  let doneMet: any = null
  while (true) {
    const data = await metricsHelpers.getPerformanceMetrics(page)
    if (data.FirstMeaningfulPaint !== 0) {
      doneMet = data
      break
    }
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  return doneMet
}

async function createGetStatsContext(
  page: any,
  url
): Promise<(string) => Promise<void>> {
  await page._client.send('Performance.enable')
  const vanilla = await metricsHelpers.getPerformanceMetrics(page)

  await page.goto(url)
  const init = await waitForFMP(page)
  console.log('[Loading Stats]')
  metricsHelpers.showInitialLoadMetrics(init, vanilla.Timestamp)
  let lastKey: string = 'init'
  let lastMet: any = vanilla
  return async (key: string = '') => {
    const nextMet = await metricsHelpers.getPerformanceMetrics(page)
    console.log(`[${lastKey}~${key}]`)
    metricsHelpers.showReadableMetrcis(
      metricsHelpers.diffMetrics(lastMet, nextMet)
    )
    lastKey = key
    lastMet = nextMet
  }
}

export async function run(
  browser: any,
  targetUrl: string,
  scenarios: Array<Function>
) {
  const page = await browser.newPage()
  const getStats = await createGetStatsContext(page, targetUrl)
  await getStats('fsm')

  for (const s of scenarios) {
    const { key } = await s(page)
    await getStats(key)
  }
  return () => page.close()
}
