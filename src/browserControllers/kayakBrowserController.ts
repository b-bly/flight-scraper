import type { Browser } from 'puppeteer'
import SearchPageController from '../pageControllers/searchPageController'
import AirportService from '../services/airportService'

export default class KayakBrowserController {
  constructor(
    private browser: Browser,
    private options: {},
    private baseUrl: string
  ) {}

  async closeBrowser() {
    const { browser } = this
    await browser.close()
  }

  async start(): Promise<void> {
    const { browser } = this
    const page = await browser.newPage()
    const airportCodes = await AirportService.getLargeAirportCodes()
    // const airportCodes = allAirportCodes.slice(0, 1)  // TODO remove.  For dev only.

    const searchPageController = new SearchPageController(
      page,
      {},
      this.baseUrl,
      this
    )

    await searchPageController.searchForFlightByUrl('MSP', 'LAS')

    // await browser.close()
    return
  }
}
