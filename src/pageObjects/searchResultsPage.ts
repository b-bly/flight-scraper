import type { Page } from 'puppeteer'
// import { sleep, retry, retryClick } from "../util/util"
// import logger from "../util/logger"
import SearchPage from './searchPage'

// TODO namespace
const ADVICE = '.col-advice [aria-busy="false"]' // shows 'loading' text until loaded
const FLIGHTS_LIST_CONTAINER = '.Flights-Results-BestFlights'
const FLIGHT_PRICE = `${FLIGHTS_LIST_CONTAINER} .price-text`

export default class SearchResultsPage extends SearchPage {
  path: string = '/flights'

  constructor(public page: Page) {
    super(page)
  }

  async waitForResults() {
    await this.page.waitForSelector(ADVICE)
  }

  async getFirstPrice() {
    const { page } = this
    await this.waitForResults()
    await page.waitForSelector(FLIGHT_PRICE)
    return page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      FLIGHT_PRICE
    )
  }

  async getFirstLink() {}
}
