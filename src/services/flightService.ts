import { Flight } from '../models/flight'

export default class FlightService {
  static async saveFlight(data: any) {
    const flight = new Flight(data)
    await flight.save()
  }

  static async getFlights(page = 1) {
    if (page < 1) {
      throw new Error('pages must be more than one')
    }
    const skip = (page - 1) * 20
    await Flight.find()
      .skip(10)
      .limit(20)
  }
}
