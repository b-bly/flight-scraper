import type { Page } from "puppeteer"
import { sleep, retry, retryClick } from "../util/util"
import logger from "../util/logger"
import Navigation from './navigation'

// TODO namespace

// const PICK_UP_LOCATION_BUTTON = '[aria-label="Pick-up location"]' // cars page
const FLIGHTS_LINK = 'a[href="/flights"'
const AIRPORT_CHIP_CLOSE_BUTTON = ".vvTc-item .vvTc-item-close"
const AIRPORT_FROM_BUTTON = '[aria-label="Flight origin input"]'
const AIRPORT_FROM_INPUT = ".k_my input" // input[placeholder="From?"]
const FROM_LIST_ITEM = 'ul[role="tablist"] li'
const FROM_CHIP =
  'div[aria-label="Flight origin input"] div[role="list"] div[role="listitem"]'
const AIRPORT_DESTINATION_BUTTON = '[aria-label="Flight destination input"]'
const AIRPORT_DESTINATION_INPUT = 'input[placeholder="To?"]'
const TO_LIST_ITEM = 'ul[role="tablist"] li'
const TO_CHIP =
  'div[aria-label="Flight destination input"] div[role="list"] div[role="listitem"]'
const SEARCH_BUTTON = '[aria-label="Search"][aria-disabled="false"]'

export default class SearchPage extends Navigation {
  path: string = "/flights"

  constructor(page: Page) {
    super(page)
  }

  async waitForPageLoad() {
    const { page } = this
    await page.waitForSelector(AIRPORT_FROM_BUTTON)
  }

  // async checkIfCarsPageLoaded () {
  //   const { page }  = this
  //   try {
  //     const airportFromButton = await page.waitForSelector(AIRPORT_FROM_BUTTON, { timeout: 10 * 1000 })
  //     return false
  //   } catch (e) {
  //     logger.error(e.message)
  //     return true
  //   }
  // }

  // async goToFlightsPage () {
  //   const page = { this }
  //   const menu = page.waitForSelector(MENU)
  //   menu.click()
  // }

  async searchForFlight(from: string, to: string) {
    const { page } = this
    const airportChipCloseButton = await page.waitForSelector(
      AIRPORT_CHIP_CLOSE_BUTTON
    )
    if (airportChipCloseButton) {
      airportChipCloseButton.click()
    }
    const fromInput = await page.waitForSelector(AIRPORT_FROM_INPUT)
    fromInput.type(from, { delay: 100 })

    await retryClick(page, FROM_LIST_ITEM)
    const fromListItem = await page.waitForSelector(FROM_LIST_ITEM)
    await fromListItem.click()

    // wait for destination to appear in chip in from box.
    await page.waitForSelector(FROM_CHIP)
    // await sleep(1)

    // *** To destination ***
    const destinationInputButton = await page.waitForSelector(
      AIRPORT_DESTINATION_BUTTON,
      { visible: true }
    )

    await page.evaluate((selector) => {
      document.querySelector(selector).click()
    }, AIRPORT_DESTINATION_BUTTON)

    // await destinationInputButton.click()
    const toInput = await page.waitForSelector(AIRPORT_DESTINATION_INPUT)
    await toInput.type(to, { delay: 100 })

    // validate text
    let value = await page.evaluate((el) => el.textContent, toInput)
    if (value.toLowerCase() !== to.toLowerCase()) {
      logger.debug("Retrying destination entry")
      await page.evaluate((selector) => (document.querySelector(selector).value = ""), AIRPORT_DESTINATION_INPUT)
      await toInput.type(to, { delay: 100 })
    }

    const toListItem = await page.waitForSelector(TO_LIST_ITEM)
    await toListItem.click()
    await page.waitForSelector(TO_CHIP)
    // TODO Select dates

    // await sleep(2)
    await page.waitForSelector(SEARCH_BUTTON)
    const searchButton = await page.$(SEARCH_BUTTON)
    return await page.evaluate(
      (selector) => document.querySelector(selector).click(),
      SEARCH_BUTTON
    )
    // return await searchButton.click()
  }
}
