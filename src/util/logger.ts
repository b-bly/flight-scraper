import winston from 'winston'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const logDir = 'logs'

if (!existsSync(logDir)) {
  // Create the directory if it does not exist
  mkdirSync(logDir)
}

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
    new winston.transports.File({
      filename: join(logDir, '/log.log'),
      level: 'debug',
    }),
  ],
}

const logger = winston.createLogger(options)

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level')
}

export default logger
