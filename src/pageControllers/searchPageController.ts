import type { Page } from 'puppeteer'
import SearchResultsPage from '../pageObjects/searchResultsPage'
import KayakBrowserController from '../browserControllers/kayakBrowserController'
import logger from '../util/logger'
import FlightService from '../services/flightService'
import { IFlightPayload } from '../models/flight'

// namespace SearchPage {
//   interface SearchPageControllerOptions {
//   }
// }

export default class SearchPageController {
  private searchPage: SearchResultsPage

  constructor(
    private page: Page,
    private options = {},
    private baseUrl: string,
    private kayakBrowserController: KayakBrowserController,
    private fromCode: string,
    private toCode: string
  ) {
    this.searchPage = new SearchResultsPage(page)
  }

  async visit(path?: string): Promise<void> {
    if (!path) {
      path = this.searchPage.path
    }
    const fullPath = this.baseUrl + path
    console.log(fullPath)
    await this.page.goto(fullPath)
    return await this.searchPage.waitForPageLoad()
  }

  async searchForFlightByUi(fromCode: string, toCode: string) {
    const { searchPage } = this
    const searchDefaults = searchPage.getSearchDefaults()
    // TODO set date as param
    const searchUrl = searchPage.getSearchUrl(fromCode, toCode, searchDefaults)
    await this.visit(searchUrl)
    // await searchPage.waitForPageToLoad()
    // await searchPage.getResultsFromUI(fromCode, toCode)
    const payload = await this.searchPage.getData(fromCode, toCode, searchDefaults)
    return await FlightService.saveFlight(payload)
  }

  async onSearchDataReceived(payload: IFlightPayload): Promise<void> {
    await FlightService.saveFlight(payload)
    await this.page.off('response', () =>
      logger.debug('Unsubscribe from response')
    )
    return
  }

  async abortInterceptSearch() {
    logger.info('Intercept search failed.  Trying searching by UI')
    const { fromCode, toCode } = this
    return await this.searchForFlightByUi(fromCode, toCode)
  }

  async searchForFlightByUrl(fromCode: string, toCode: string) {
    const { searchPage } = this
    await searchPage.interceptSearchRequest(this)
    const searchDefaults = searchPage.getSearchDefaults()
    const searchUrl = searchPage.getSearchUrl(fromCode, toCode, searchDefaults)
    await this.visit(searchUrl)
  }
}
