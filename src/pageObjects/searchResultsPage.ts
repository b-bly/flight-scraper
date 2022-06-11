import type { Page } from 'puppeteer'
// import { sleep, retry, retryClick } from "../util/util"
// import logger from "../util/logger"
import SearchPage from './searchPage'
import { IFlightPayload } from '../models/flight'

// TODO namespace
const ADVICE = '.col-advice [aria-busy="false"]' // shows 'loading' text until loaded
const FLIGHTS_LIST_CONTAINER = '.Flights-Results-BestFlights'
const BEST_FLIGHTS_CONTAINER = '.best-flights-list'
const FLIGHT_PRICE = `${BEST_FLIGHTS_CONTAINER} .price-text`
const AIRLINES = `${BEST_FLIGHTS_CONTAINER} .name-only-text`
const DEPART_TIME = `${BEST_FLIGHTS_CONTAINER} .depart-time`
const ARRIVAL_TIME = `${BEST_FLIGHTS_CONTAINER} .arrival-time`
const URL = `${BEST_FLIGHTS_CONTAINER} .booking-link`

export default class SearchResultsPage extends SearchPage {
  path: string = '/flights'

  constructor(public page: Page) {
    super(page)
  }

  async waitForPageToLoad() {
    await this.page.waitForSelector(ADVICE)
  }

  async getFirstPrice() {
    await this.page.waitForSelector(FLIGHT_PRICE)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      FLIGHT_PRICE
    )
  }

  async getFirstAirline() {
    const { page } = this
    await this.page.waitForSelector(AIRLINES)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      AIRLINES
    )
  }

  async getFirstDepartureTime() {
    const { page } = this
    await this.page.waitForSelector(DEPART_TIME)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      DEPART_TIME
    )
  }

  async getFirstUrl() {
    const { page } = this
    await this.page.waitForSelector(URL)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      URL
    )
  }

  async getFirstArrivalTime() {
    const { page } = this
    await this.page.waitForSelector(ARRIVAL_TIME)
    return page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      ARRIVAL_TIME
    )
  }

  async getData(fromCode: string, toCode: string) {
    // const {
    //   getFirstPrice,
    //   getFirstAirline,
    //   getFirstDepartureTime,
    //   getFirstUrl,
    // } = this

    const priceString = await this.getFirstPrice()
    const price = priceString.replace('$', '').replace(/,/g, '')
    const airlines = await this.getFirstAirline()
    const destination = toCode
    const arrivalTimeString = await this.getFirstArrivalTime()
    const arrivalTime = new Date(arrivalTimeString)
    const departure = fromCode
    const departureTimeString = await this.getFirstDepartureTime()
    const departureTime = new Date(departureTimeString)
    const relativeUrl = await this.getFirstUrl()
    const url = `https://kayak.com${relativeUrl}`
    const data: IFlightPayload = {
      price,
      airlines,
      destination,
      arrivalTime,
      departure,
      departureTime,
      url,
    }
    console.log(data)
    // return data
    console.log(departureTimeString)
  }
}
