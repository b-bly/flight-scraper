import puppeteer from "puppeteer"
import KayakBrowserController from "./browserControllers/kayakBrowserController"

export default class Runner {
  constructor(private options: {}) {}

  async start() {
    const { options } = this
    const browser = await puppeteer.launch(options)
    const kayakBrowserController = new KayakBrowserController(
      browser,
      options,
      "https://kayak.com"
    )
    await kayakBrowserController.start()
  }
}
