import puppeteer from 'puppeteer'
import KayakBrowserController from './browserControllers/kayakBrowserController'

const defaultOptions = {
  headless: true,
  args: [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-sandbox",
  ]
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
