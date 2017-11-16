/* @flow */
export type Metrics = {
  Timestamp: number,
  AudioHandlers: number,
  Documents: number,
  Frames: number,
  JSEventListeners: number,
  LayoutObjects: number,
  MediaKeySessions: number,
  MediaKeys: number,
  Nodes: number,
  Resources: number,
  ScriptPromises: number,
  SuspendableObjects: number,
  V8PerContextDatas: number,
  WorkerGlobalScopes: number,
  UACSSResources: number,
  LayoutCount: number,
  RecalcStyleCount: number,
  LayoutDuration: number,
  RecalcStyleDuration: number,
  ScriptDuration: number,
  TaskDuration: number,
  JSHeapUsedSize: number,
  JSHeapTotalSize: number,
  FirstMeaningfulPaint: number,
  DomContentLoaded: number,
  NavigationStart: number
}

export async function getPerformanceMetrics(page: any): Promise<Metrics> {
  // return page.metrics()
  const { metrics } = await page._client.send('Performance.getMetrics')
  return metrics.reduce((acc, i) => ({ ...acc, [i.name]: i.value }), {})
}

export function diffMetrics(prev: Metrics, next: Metrics): Metrics {
  const targetKeys = Object.keys(prev)
  const delta: any = targetKeys.reduce((acc, key) => {
    const p = prev[key]
    const n = next[key]
    return { ...acc, [key]: n - p }
  }, {})
  return delta
}

const rn = (x, n = 1) => Math.floor(x * Math.pow(10, n)) / Math.pow(10, n)

export function showReadableMetrcis(m: Metrics) {
  const cpuUsage = ~~(m.TaskDuration / m.Timestamp * 100)
  console.log(`TaskDuration: ${rn(m.TaskDuration)}s / Usage ${cpuUsage}%`)

  const scriptDurationRate = m.ScriptDuration / m.TaskDuration * 100
  console.log(
    `  - ScriptDuration: ${rn(m.ScriptDuration, 3)}s / ${rn(
      scriptDurationRate
    )}%`
  )

  const layoutDurationRate = m.LayoutDuration / m.TaskDuration * 100
  console.log(
    `  - LayoutDuration: ${rn(m.LayoutDuration, 3)}s / ${rn(
      layoutDurationRate
    )}%`
  )

  const recalcStyleDurationRate = m.RecalcStyleDuration / m.TaskDuration * 100
  console.log(
    `  - RecalcStyleDuration: ${rn(m.RecalcStyleDuration, 3)}s / ${rn(
      recalcStyleDurationRate
    )}%`
  )

  console.log(`  - LayoutCount: +${rn(m.LayoutCount, 3)}`)
  console.log(`  - RecalcStyleCount: +${rn(m.RecalcStyleCount, 3)}`)
}

export function showInitialLoadMetrics(m: Metrics, baseTimestamp: number = 0) {
  console.log(
    ` - FirstMeaningfulPaint: ${rn(m.FirstMeaningfulPaint - baseTimestamp, 3)}s`
  )
  console.log(
    ` - DomContentLoaded: ${rn(m.DomContentLoaded - baseTimestamp, 3)}s`
  )
}
