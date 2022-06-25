import { IFlight } from './IFlight'

export class Flight {
  public price: number
  public airlines: [string]
  public destination: string
  public arrivalTime: Date
  public departure: string
  public departureTime: Date
  public url: string
  constructor (flight: IFlight) {
    this.price = flight.price
    this.airlines = flight.airlines
    this.destination = flight.destination
    this.arrivalTime = new Date(flight.arrivalTime)
    this.departure = flight.departure
    this.departureTime = new Date(flight.departureTime)
    this.url = flight.url
  }
}
