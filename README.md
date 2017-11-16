# @mizchi/puppeteer-helper

Experimental puppeteer helper

## CLI

```
$ npm install -g @mizchi/puppeteer-helper
$ get-puppeteer-metrics https://dev.to
[Loading Stats]
 - FirstMeaningfulPaint: 0.216s
 - DomContentLoaded: 0.336s
[init~fsm]
TaskDuration: 0.4s / Usage 39%
  - ScriptDuration: 0.066s / 13.5%
  - LayoutDuration: 0.26s / 53.4%
  - RecalcStyleDuration: 0.019s / 3.9%
  - LayoutCount: +13
  - RecalcStyleCount: +19
```

with scenario.js

```js
module.exports = [
  async _page => {
    // Do something
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      key: 'observe-with-wait'
    }
  }
]
```

```
$ get-puppeteer-metrics https://dev.to examples/scenario.js
[Loading Stats]
- FirstMeaningfulPaint: 0.478s
- DomContentLoaded: 0.248s
[init~fsm]
TaskDuration: 0.5s / Usage 41%
 - ScriptDuration: 0.082s / 14.6%
 - LayoutDuration: 0.29s / 51.9%
 - RecalcStyleDuration: 0.02s / 3.5%
 - LayoutCount: +10
 - RecalcStyleCount: +17
[fsm~observe-with-wait]
TaskDuration: 0s / Usage 4%
 - ScriptDuration: 0.025s / 59.9%
 - LayoutDuration: 0s / 0%
 - RecalcStyleDuration: 0s / 0%
 - LayoutCount: +0
 - RecalcStyleCount: +0
```

## Node API

```js
/* @flow */
import puppeteer from 'puppeteer'
import { run } from '@mizchi/puppeteer-helper'

const targetUrl = process.argv[2]

async function start() {
  const browser = await puppeteer.launch({})
  await run(browser, targetUrl, [
    _page => {
      return {
        key: 'FSM'
      }
    }
  ])
  await browser.close()
}

start()
```

## License

MIT by @mizchi
