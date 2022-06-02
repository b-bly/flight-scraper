import { Schema, model } from 'mongoose'

interface IFlight {
  price: Number
  airlines: [String]
  destination: String
  arrivalTime: Date
  departure: String
  departureTime: Date
}

export interface IFlightPayload {
  price: IFlight['price']
  airlines: IFlight['airlines']
  destination: IFlight['destination']
  arrivalTime: IFlight['arrivalTime']
  departure: IFlight['departure']
  departureTime: IFlight['departureTime']
}

const flightSchema = new Schema<IFlight>({
  price: { type: Number, required: true },
})

export const Flight = model<IFlight>('Flight', flightSchema)
