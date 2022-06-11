import type { Page } from 'puppeteer'
import SearchResultsPage from '../pageObjects/searchResultsPage'
import KayakBrowserController from '../browserControllers/kayakBrowserController'

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
    private kayakBrowserController: KayakBrowserController
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

  async searchForFlight(airportCodes: string[]) {
    await this.searchPage.searchForFlight('TUS', 'CHI')
    const price = await this.searchPage.getFirstPrice()
    console.log(price)
  }

  async onSearchDataReceived() {
    await this.page.close()
    await this.kayakBrowserController.closeBrowser()
  }

  async searchForFlightByUrl(fromCode: string, toCode: string) {
    const { searchPage } = this
    await searchPage.interceptSearchRequest(this)
    const searchDefaults = searchPage.getSearchDefaults()
    const searchUrl = searchPage.getSearchUrl(fromCode, toCode, searchDefaults)
    console.log(searchUrl)
    await this.visit(searchUrl)
  }
}
