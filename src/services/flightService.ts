import { Flight } from '../models/flight'

export default class FlightService {
  static async saveFlight(data: any) {
    const flight = new Flight(data)
    await flight.save()
  }
}
