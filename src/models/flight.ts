import { Schema, model } from 'mongoose'

export interface IFlight {
  price: Number
  airlines: [String]
  destination: String
  arrivalTime: Date
  departure: String
  departureTime: Date
  url: String
}

export interface IFlightPayload {
  price: IFlight['price']
  airlines: IFlight['airlines']
  destination: IFlight['destination']
  arrivalTime: IFlight['arrivalTime']
  departure: IFlight['departure']
  departureTime: IFlight['departureTime']
  url: IFlight['url']
}

const flightSchema = new Schema<IFlight>({
  price: { type: Number, required: true },
  airlines: [String],
  destination: String,
  arrivalTime: Date,
  departure: String,
  departureTime: Date,
  url: String,
})

export const Flight = model<IFlight>('Flight', flightSchema)
