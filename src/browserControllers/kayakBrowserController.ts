import type { Browser } from "puppeteer"
import SearchPageController from '../pageControllers/searchPageController'

export default class KayakBrowserController {
  constructor(private browser: Browser, private options: {}, private baseUrl: string) {}

  async start(): Promise<void> {
    const { browser } = this
    const page = await browser.newPage()
    const searchPageController = new SearchPageController(page, {})
    await searchPageController.visit(this.baseUrl)
    // await page.screenshot({path: 'screenshots/homePage.png'})
    await searchPageController.searchForFlight()
  }
}
