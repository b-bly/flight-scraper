import logger from './logger'
import dotenv from 'dotenv'
import fs from 'fs'

export const MAX_RETRIES = 3

if (fs.existsSync('../../.env')) {
  logger.debug('Using .env file to supply config environment variables')
  dotenv.config({ path: '../../.env' })
}

export const ENVIRONMENT = process.env.NODE_ENV
const prod = ENVIRONMENT === 'production' // Anything else is treated as 'dev'

logger.debug(`NODE_ENV = ${process.env.NODE_ENV}`)

let mongodbUri = 'mongodb://0.0.0.0:27017/flight'
if (prod === true) {
  mongodbUri = process.env.MONGODB_URI
}

logger.debug(`Setting MONGODB_URI to ${mongodbUri}`)

export const MONGODB_URI = mongodbUri
export const TWO_CAPTCHA_KEY = process.env['TWO_CAPTCHA_KEY']

if (TWO_CAPTCHA_KEY) {
  logger.error('No client secret. Set 2CAPTCHA_KEY environment variable.')
  process.exit(1)
}
