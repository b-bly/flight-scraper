import { Schema, model, connect } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
interface IFlight {
  price: Number
}

// 2. Create a Schema corresponding to the document interface.
const flightSchema = new Schema<IFlight>({
  price: { type: Number, required: true },
})

// 3. Create a Model.
const Flight = model<IFlight>('Flight', flightSchema)

run().catch((err) => console.log(err))

async function run() {
  // 4. Connect to MongoDB
  await connect('mongodb://0.0.0.0:27017/test')

  const flight = new Flight({
    price: 100
  })
  await flight.save()

  console.log(flight.price) // 'bill@initech.com'
}
