import puppeteer from 'puppeteer-extra'
import KayakBrowserController from './browserControllers/kayakBrowserController'
// https://stackoverflow.com/questions/51731848/how-to-avoid-being-detected-as-bot-on-puppeteer-and-phantomjs
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import AdblockerPlugin from 'puppeteer-extra-plugin-stealth'
import { TWO_CAPTCHA_KEY } from './util/constants'
// puppeteer.use(StealthPlugin())

const stealth = false // move to cli
const recaptchaOptions = {
  id: '2captcha',
  token: TWO_CAPTCHA_KEY
}
// TODO: Make cli
const defaultOptions = {
  headless: false,
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
    await puppeteer.use(AdblockerPlugin({

    }))
    // if (stealth === true) {
    //   await puppeteer.use(RecaptchaPlugin(recaptchaOptions)).use(StealthPlugin())
    // } else {
      await puppeteer.use(RecaptchaPlugin()).use(StealthPlugin())
    // }
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
