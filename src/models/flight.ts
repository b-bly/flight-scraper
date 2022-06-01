import { Schema, model } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
interface IFlight {
  price: Number
}

// 2. Create a Schema corresponding to the document interface.
const flightSchema = new Schema<IFlight>({
  price: { type: Number, required: true },
})

// 3. Create a Model.
export const Flight = model<IFlight>('Flight', flightSchema)



