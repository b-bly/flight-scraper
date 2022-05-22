import type { Page } from "puppeteer"
import SearchResultsPage from "../pageObjects/searchResultsPage"

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

  async searchForFlight() {
    await this.searchPage.searchForFlight("MSP", "FLR")
  }
}
