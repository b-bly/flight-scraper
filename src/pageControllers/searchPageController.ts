import type { Page } from "puppeteer"
import SearchResultsPage from "../pageObjects/searchResultsPage"

// namespace SearchPage {
//   interface SearchPageControllerOptions {
//   }
// }

export default class SearchPageController {
  private searchPage: SearchResultsPage

  constructor(private page: Page, private options = {}) {
    this.searchPage = new SearchResultsPage(page)
  }

  async visit(baseUrl: string): Promise<void> {
    const { page, searchPage } = this
    const { path } = this.searchPage
    await page.goto(baseUrl + path)
    return await searchPage.waitForPageLoad()
  }

  async searchForFlight(airportCodes: string[]) {
    await this.searchPage.searchForFlight("TUS", "CHI")
    const price = await this.searchPage.getFirstPrice()
    console.log(price)
  }
}
