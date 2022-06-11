import type { Browser } from 'puppeteer'
import SearchPageController from '../pageControllers/searchPageController'
import AirportService from '../services/airportService'
import logger from '../util/logger'

export default class KayakBrowserController {
  constructor(
    private browser: Browser,
    private options: {},
    private baseUrl: string
  ) {}

  async closeBrowser() {
    const { browser } = this
    await logger.debug('closing browser')
    return await browser.close()
  }

  async exit(caller = this) {
    try {
      await caller.closeBrowser()
    } catch (e) {
      logger.error(e.message)
    }
    await logger.debug('Exiting node.')
    return process.exit()
  }

  async start(): Promise<void> {
    const { browser } = this

    // const page = await browser.newPage()
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()
    await page.setCacheEnabled(false)

    // const airportCodes = await AirportService.getLargeAirportCodes()
    // const airportCodes = allAirportCodes.slice(0, 1)  // TODO remove.  For dev only.

    const fromCode = 'MSP'
    const toCode = 'YOW'
    const searchPageController = new SearchPageController(
      page,
      {},
      this.baseUrl,
      this,
      fromCode,
      toCode
    )

    await searchPageController.searchForFlightByUi(fromCode, toCode) // LAS
    return
  }
}
