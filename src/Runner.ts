import puppeteer from 'puppeteer-extra'
import KayakBrowserController from './browserControllers/kayakBrowserController'
// https://stackoverflow.com/questions/51731848/how-to-avoid-being-detected-as-bot-on-puppeteer-and-phantomjs
import { PuppeteerExtra } from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import AdblockerPlugin from 'puppeteer-extra-plugin-stealth'

// puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin())
puppeteer.use(RecaptchaPlugin()).use(StealthPlugin())

// TODO: Make cli
const defaultOptions = {
  headless: true,
  args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-sandbox',
  ],
}

export default class Runner {
  constructor(private options: {} = defaultOptions) {}

  async start() {
    const { options } = this
    const browser = await puppeteer.launch(options)
    const kayakBrowserController = new KayakBrowserController(
      browser,
      options,
      'https://kayak.com'
    )
    await kayakBrowserController.start()
    // await browser.close()
  }
}
