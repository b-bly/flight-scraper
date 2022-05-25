import { getJsonFromCsv } from "../util/util"
import path from "path"

interface Airport {
  ident: string
  type: string
}

enum AirportType {
  smallAirport = "small_airport",
  heliport = "heliport",
  mediumAirport = "medium_airport",
  largeAirport = "large_airport",
}

export default class AirportService {
  static saveLargeAirportCodes() {
    const cb = (data: Airport[]) =>
      data.filter((airport: Airport) => /large/i.test(airport.type))
    const airportData = getJsonFromCsv(
      path.resolve(__dirname, "../../support/sc-est2019-alldata6.csv"),
      cb
    )
  }
}
