import type { Browser } from "puppeteer"
import SearchPageController from "../pageControllers/searchPageController"
import AirportService from "../services/airportService"

export default class KayakBrowserController {
  constructor(
    private browser: Browser,
    private options: {},
    private baseUrl: string
  ) {}

  async start(): Promise<void> {
    const { browser } = this
    const page = await browser.newPage()
    const allAirportCodes = await AirportService.saveLargeAirportCodes()
    // const airportCodes = allAirportCodes.slice(0, 1)  // TODO remove.  For dev only.
    console.log(allAirportCodes)

    const searchPageController = new SearchPageController(page, {})
    await searchPageController.visit(this.baseUrl)
    // await page.screenshot({path: 'screenshots/homePage.png'})
    // await searchPageController.searchForFlight(airportCodes)
  }
}
