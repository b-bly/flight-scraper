import type { Page } from 'puppeteer'
import SearchResultsPage from '../pageObjects/searchResultsPage'
import KayakBrowserController from '../browserControllers/kayakBrowserController'
import logger from '../util/logger'

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
    const searchUrl = searchPage.getSearchUrl(fromCode, toCode, searchDefaults)
    await this.visit(searchUrl)
    // await searchPage.waitForPageToLoad()
    // await searchPage.getResultsFromUI(fromCode, toCode)
    const data = await this.searchPage.getData(fromCode, toCode)
    return data
  }

  async onSearchDataReceived() {
    await this.page.close()
    await this.page.off('response', () =>
      logger.debug('Unsubscribe from response')
    )
    await this.kayakBrowserController.exit()
  }

  async abortInterceptSearch() {
    const { fromCode, toCode } = this
    logger.debug('Intercept search failed.  Trying searching by UI')
    return await this.searchForFlightByUrl(fromCode, toCode)
  }

  async searchForFlightByUrl(fromCode: string, toCode: string) {
    const { searchPage } = this
    await searchPage.interceptSearchRequest(this)
    const searchDefaults = searchPage.getSearchDefaults()
    const searchUrl = searchPage.getSearchUrl(fromCode, toCode, searchDefaults)
    await this.visit(searchUrl)
  }
}
