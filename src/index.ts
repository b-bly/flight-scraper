import Runner from './runner'
// const express = require('express')
import express, { Request, Response } from 'express'
import './database'
import { Flight } from './models/flight'
import FlightService from './services/flightService'
import { connectToMongo } from './database'
import logger from './util/logger'
import { flights } from './routes/flights'
import { allowedExt } from './util/constants'
import './util/constants'

const fs = require('fs')
const existsSync = fs.existsSync
const path = require('path')
const { exec } = require('child_process')

connectToMongo()

// let options: {} = {
//   headless: false,
//   args: [
//     '--disable-gpu',
//     '--disable-dev-shm-usage',
//     '--disable-setuid-sandbox',
//     '--no-sandbox',
//   ],
// }

let options: {} = {
	headless: false,
	executablePath: '/Applications/Google Chrome.app',
	args: [
	  '--disable-gpu',
	  '--disable-dev-shm-usage',
	  '--disable-setuid-sandbox',
	  '--no-sandbox',
	],
  }


if (process.env.NODE_ENV === 'production') {
  // for chrome (set PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true)
  options = {
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-sandbox',
    ]
  }

  // chromium
  // options = {
  //   headless: true,
  //   args: [
  //     '--disable-gpu',
  //     '--disable-dev-shm-usage',
  //     '--disable-setuid-sandbox',
  //     '--no-sandbox',
  //   ]
  // }
}
// TODO Uncomment when db and server are done
const runner = new Runner(options)
runner.start()

const app = express()
// TODO: Set as env
const port = 8080

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('/api/flights', flights)

// ==== if its production environment
const clientPath = '../frontend/build/'
if (process.env.NODE_ENV === 'production') {
  logger.info('GET static files')
  const path = require('path')
  app.use('/static', express.static(path.join(__dirname, clientPath, 'static')))
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, clientPath, 'index.html'))
  })

  app.get('*', (req, res) => {
    // if there is a file extension, send the file

    if (allowedExt.filter((ext) => req.url.indexOf(ext) > 0).length > 0) {
      // remove any querystring like '?q=search-terms'
      req.url = req.url.replace(/\?.*/g, '')

      res.sendFile(path.resolve(__dirname, `${clientPath}${req.url}`))
    } else {
      res.sendFile(path.resolve(__dirname, `${clientPath}index.html`))
    }
  })
}

// Test db connection

// connectToMongo().then(() => {
//   const flight = new Flight({
//     price: 100,
//     airlines: ['Delta'],
//     destination: 'Somewhere',
//     arrivalTime: '6-10-2022',
//     departure: 'MSP',
//     departureTime: new Date(),
//     url: 'www.example.com',
//   })

//   logger.debug('here we go')
//   FlightService.saveFlight(flight)
// })
