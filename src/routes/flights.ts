import { Router, Request, Response } from 'express'
import FlightService from '../services/flightService'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  FlightService.getFlights().then((flights) => {
    res.send(flights)
  })
})

export const flights = router
