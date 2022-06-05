import Runner from './runner'
// const express = require('express')
import express, { Request, Response } from 'express'
import './database'
import { Flight } from './models/flight'
import FlightService from './services/flightService'
import { connectToMongo } from './database'
import logger from './util/logger'

const fs = require('fs')
const existsSync = fs.existsSync
const path = require('path')
const { exec } = require('child_process')

connectToMongo()

// TODO Uncomment when db and server are done
const runner = new Runner()
runner.start()

const app = express()
// TODO: Set as env
const port = 8080

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', (_req: Request, res: Response) => {
  FlightService.getFlights().then(flights => {
    console.log(flights)
    res.send(flights[0])
  })
})

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
