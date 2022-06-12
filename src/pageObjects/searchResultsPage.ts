import type { Page } from 'puppeteer'
import SearchPage from './searchPage'
import { IFlightPayload } from '../models/flight'
import { FlightSearchParameters } from './searchPage'
import { convertTo24 } from '../util/util'

// TODO namespace
namespace SearchPageConstants {
  export const ADVICE = '.col-advice [aria-busy="false"]' // shows 'loading' text until loaded
  export const FLIGHTS_LIST_CONTAINER = '.Flights-Results-BestFlights'
  export const BEST_FLIGHTS_CONTAINER = '.best-flights-list'
  export const FLIGHT_PRICE = `${BEST_FLIGHTS_CONTAINER} .price-text`
  export const AIRLINES = '.best-flights-list .times .bottom' //`${BEST_FLIGHTS_CONTAINER} .name-only-text`
  export const DEPART_TIME = `${BEST_FLIGHTS_CONTAINER} .depart-time`
  export const DEPARTURE_TIME_AMPM =
    '.best-flights-list .time-pair:nth-of-type(3) .time-meridiem'
  export const ARRIVAL_TIME = `${BEST_FLIGHTS_CONTAINER} .arrival-time`
  export const ARRIVAL_TIME_AMPM =
    '.best-flights-list .time-pair:nth-of-type(1) .time-meridiem'
  export const URL = `${BEST_FLIGHTS_CONTAINER} .booking-link`
}

export default class SearchResultsPage extends SearchPage {
  path: string = '/flights'

  constructor(public page: Page) {
    super(page)
  }

  async waitForPageToLoad() {
    await this.page.waitForSelector(SearchPageConstants.ADVICE)
  }

  async getFirstPrice() {
    await this.page.waitForSelector(SearchPageConstants.FLIGHT_PRICE)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      SearchPageConstants.FLIGHT_PRICE
    )
  }

  async getFirstAirline() {
    const { page } = this
    await this.page.waitForSelector(SearchPageConstants.AIRLINES)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      SearchPageConstants.AIRLINES
    )
  }

  async getFirstDepartureTime() {
    const { page } = this
    await this.page.waitForSelector(SearchPageConstants.DEPART_TIME)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      SearchPageConstants.DEPART_TIME
    )
  }

  async getDepartureAmPm() {
    await this.page.waitForSelector(SearchPageConstants.DEPARTURE_TIME_AMPM)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      SearchPageConstants.DEPARTURE_TIME_AMPM
    )
  }

  async getFirstUrl() {
    const { page } = this
    await this.page.waitForSelector(SearchPageConstants.URL)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      SearchPageConstants.URL
    )
  }

  async getFirstArrivalTime() {
    await this.page.waitForSelector(SearchPageConstants.ARRIVAL_TIME)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      SearchPageConstants.ARRIVAL_TIME
    )
  }

  async getArrivalAmPm() {
    await this.page.waitForSelector(SearchPageConstants.ARRIVAL_TIME_AMPM)
    return this.page.evaluate(
      (selector) => document.querySelector(selector).textContent,
      SearchPageConstants.ARRIVAL_TIME_AMPM
    )
  }

  async getData(
    fromCode: string,
    toCode: string,
    searchParameters: FlightSearchParameters
  ) {
    const date = searchParameters.date
    const priceString = await this.getFirstPrice()
    const price = priceString.trim().replace('$', '').replace(/,/g, '').trim()
    const airlinesRaw = await this.getFirstAirline()
    const airlines = airlinesRaw.trim()
    const destination = toCode
    const arrivalTimeString = await this.getFirstArrivalTime()
    const arrivalTimeAmPm = await this.getArrivalAmPm()
    const arrivalTime24 = convertTo24(arrivalTimeString, arrivalTimeAmPm)
    const arrivalTime = new Date(
      `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${arrivalTime24}:00`
    )
    const departure = fromCode
    const departureTimeString = await this.getFirstDepartureTime()
    const departureTimeAmPm = await this.getArrivalAmPm()
    const departureTime24 = convertTo24(departureTimeString, departureTimeAmPm)
    const departureTime = new Date(
      `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${departureTime24}:00`
    )
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
