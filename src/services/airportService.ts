import { getJsonFromCsv } from "../util/util"
import path from "path"
// import { writeFileSync } from "fs" 

interface Airport {
  ident: string
  type: AirportType
  iata_code: string
}

enum AirportType {
  smallAirport = "small_airport",
  heliport = "heliport",
  mediumAirport = "medium_airport",
  largeAirport = "large_airport",
}

export default class AirportService {
  static async saveLargeAirportCodes(): Promise<string[]> {
    return (
      await getJsonFromCsv(
        path.resolve(__dirname, "../../support/airport-codes.csv")
      )
    )
      .filter((airport: Airport) => /large/i.test(airport.type) ) //&& airport.iata_code?.length > 0
      .map((airport: Airport) => airport.iata_code)
    // .writeFileSync('../../support/largeAirportCodes.json')
  }
}
