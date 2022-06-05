import mongoose from 'mongoose'
import logger from './util/logger'
import { MONGODB_URI } from './util/constants';

// TODO config
// https://stackoverflow.com/questions/46523321/mongoerror-connect-econnrefused-127-0-0-127017
const connectionString = MONGODB_URI // 'mongodb://0.0.0.0:27017/flight'

export const connectToMongo = async () => {
  try {
    const connection = await mongoose.connect(connectionString)
    logger.debug('Connected to mongo.')
    return connection
  } catch (error) {
    logger.error(`Error connecting to db: ${error.message}`)
  }
}
