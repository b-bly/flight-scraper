import { Flight } from '../models/Flight'
import { IFlight } from '../models/IFlight';

class FlightService {
  async get(url: string) {
    try {
      const res = await fetch(url);
      console.log(res)
      return await res.json();
    } catch (e) {
      console.log(e);
    }
  }

  async getFlights(): Promise<Flight[]> {
    const url = '/api/flights';
    const data: IFlight[] = await this.get(url);
    console.log(data)
    return data.map((record: IFlight) => new Flight(record));
  }
}

export default FlightService
