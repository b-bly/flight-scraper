import type { Page } from 'puppeteer'
import { retryClick } from '../util/util'
import logger from '../util/logger'
import Navigation from './navigation'
import { IFlightPayload } from '../models/flight'
import FlightService from '../services/flightService';

enum Sort {
  duration = 'duration',
  bestflight = 'bestflight',
  price = 'price',
}

interface FlightSearchParameters {
  sort: Sort
  numberAdults: number
  date: Date
}

// TODO namespace

// const PICK_UP_LOCATION_BUTTON = '[aria-label="Pick-up location"]' // cars page
const FLIGHTS_LINK = 'a[href="/flights"'
const AIRPORT_CHIP_CLOSE_BUTTON = '.vvTc-item .vvTc-item-close'
const AIRPORT_FROM_BUTTON = '[aria-label="Flight origin input"]'
const AIRPORT_FROM_INPUT = '.k_my input' // input[placeholder="From?"]
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
  path: string = '/flights'

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
      logger.debug('Retrying destination entry')
      await page.evaluate(
        (selector) => (document.querySelector(selector).value = ''),
        AIRPORT_DESTINATION_INPUT
      )
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

  getSearchDefaults(): FlightSearchParameters {
    return {
      sort: Sort.bestflight,
      numberAdults: 1,
      date: new Date(),
    }
  }

  getSearchUrl(
    fromCode: string,
    toCode: string,
    urlParameters?: FlightSearchParameters
  ) {
    let { sort, numberAdults, date } = urlParameters
    // example https://www.kayak.com/flights/MSP-CHI/2022-07-01?sort=bestflight_a&attempt=1&lastms=1653771259468
    //         https://www.kayak.com/flights/MSP-LAS/2022-5-6/1adults?sort=bestflight_aa
    const convertToTwoDigits = (oneOrTwodigits: string) =>
      oneOrTwodigits.length < 2
        ? '0'.concat(oneOrTwodigits).slice(-2)
        : oneOrTwodigits
    // defaults
    const adults = `${numberAdults.toString()}adults`
    const dateParam = `${date.getFullYear()}-${convertToTwoDigits(
      (date.getMonth() + 1).toString()
    )}-${convertToTwoDigits(date.getDate().toString())}`

    return `/flights/${fromCode}-${toCode}/${dateParam}/${adults}?sort=${sort}_a`
  }

  convertToFlight(data: any): IFlightPayload {
    return {
      price: data.legs[0]?.segments[0],
      airlines: data.legs[0]?.segments[0]?.airline?.code,
      destination: data.legs[0]?.segments[0]?.arrival.airport.code,
      arrivalTime: data.legs[0]?.segments[0]?.arrival.isoDateTimeLocal,
      departure: data.legs[0]?.segments[0]?.departure.airport.code,
      departureTime: data.legs[0]?.segments[0]?.arrival.isoDateTimeLocal,
    }
  }

  async interceptSearchRequest() {
    // Intercept example url https://www.kayak.com/s/horizon/flights/results/FlightSearchPoll?p=1

    const { page } = this
    await page.setRequestInterception(true)
    page.on('request', async (req) => {
      req.continue()
    })

    const theBody = await page.on('response', async (res) => {
      // TODO Just intercept first page and first result?
      const urlRegex = /s\/horizon\/flights\/results\/FlightSearchPoll/i
      if (urlRegex.test(await res.url())) {
        const body = await res.json()
        const data = body?.react?.components[1]?.props?.result //?.optionsByFare[0] // [0]

        if (body.react) console.log(data)
        if (data) {
          // TODO Save data to db
          const payload = this.convertToFlight(data)
          return FlightService.saveFlight(payload)
        }
        // res.ok()
      }
      res.ok()
    })
  }
}
