import type { Page } from 'puppeteer'
// import { sleep, retry, retryClick } from "../util/util"
// import logger from "../util/logger"
import SearchPage from './searchPage'
import { IFlightPayload } from '../models/flight'
import { FlightSearchParameters } from './searchPage'
import { convertTo24 } from '../util/util'

// TODO namespace
const ADVICE = '.col-advice [aria-busy="false"]' // shows 'loading' text until loaded
const FLIGHTS_LIST_CONTAINER = '.Flights-Results-BestFlights'
const BEST_FLIGHTS_CONTAINER = '.best-flights-list'
const FLIGHT_PRICE = `${BEST_FLIGHTS_CONTAINER} .price-text`
const AIRLINES = '.best-flights-list .times .bottom' //`${BEST_FLIGHTS_CONTAINER} .name-only-text`
const DEPART_TIME = `${BEST_FLIGHTS_CONTAINER} .depart-time`
const DEPARTURE_TIME_AMPM = '.best-flights-list .time-pair:nth-of-type(3) .time-meridiem'
const ARRIVAL_TIME = `${BEST_FLIGHTS_CONTAINER} .arrival-time`
const ARRIVAL_TIME_AMPM = '.best-flights-list .time-pair:nth-of-type(1) .time-meridiem'
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

  async getDepartureAmPm() {
    await this.page.waitForSelector(DEPARTURE_TIME_AMPM)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      DEPARTURE_TIME_AMPM
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
    await this.page.waitForSelector(ARRIVAL_TIME)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      ARRIVAL_TIME
    )
  }

  async getArrivalAmPm() {
    await this.page.waitForSelector(ARRIVAL_TIME_AMPM)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      ARRIVAL_TIME_AMPM
    )
  }

  async getData(fromCode: string, toCode: string, searchParameters: FlightSearchParameters) {
    // const {
    //   getFirstPrice,
    //   getFirstAirline,
    //   getFirstDepartureTime,
    //   getFirstUrl,
    // } = this
    const date = searchParameters.date
    const priceString = await this.getFirstPrice()
    const price = priceString.trim().replace('$', '').replace(/,/g, '').trim()
    const airlinesRaw = await this.getFirstAirline()
    const airlines = airlinesRaw.trim()
    const destination = toCode
    const arrivalTimeString = await this.getFirstArrivalTime()
    const arrivalTimeAmPm = await this.getArrivalAmPm()
    const arrivalTime24 = convertTo24(arrivalTimeString, arrivalTimeAmPm)
    // const year = date.getFullYear()
    // const month = date.getMonth()
    // const theDate = date.getDate()
    const arrivalTime = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${arrivalTime24}:00`)
    const departure = fromCode
    const departureTimeString = await this.getFirstDepartureTime()
    const departureTimeAmPm = await this.getArrivalAmPm()
    const departureTime24 = convertTo24(departureTimeString, departureTimeAmPm)
    const departureTime = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${departureTime24}:00`)
    const relativeUrl = await this.getFirstUrl()
    const url = `https://kayak.com${relativeUrl.trim()}`
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
    return data
  }
}
