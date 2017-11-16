/* @flow */
import puppeteer from 'puppeteer'
import { run, delay } from '../src'

const targetUrl = process.argv[2]

async function start() {
  const browser = await puppeteer.launch({})
  await run(browser, targetUrl, [
    async page => {
      // Do something
      await delay(300)
      return {
        key: 'observe-with-wait'
      }
    }
  ])
  await browser.close()
}

start()
