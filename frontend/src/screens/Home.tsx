import React, { Component, Fragment, useState, useEffect } from 'react'
import './Home.css'
import { Flight } from '../models/Flight'
import FlightService from '../services/flightService'

const flightService = new FlightService()

// TODO Props
export const Home: React.FC = () => {
  // constructor(props: any}) {
  //   super(props)
  //   this.state = {}
  // }

  // TODO type
  const [data, setData] = useState<Flight[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getData = async () => {
    setLoading(true)
    const data = await flightService.getFlights()
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    if (data && data.length < 1 && !loading) {
      getData()
      console.log('getting data')
    }
  })

  // const exampleFlights: Flight[] = [
  //   {
  //     price: 100,
  //     airlines: ['Delta'],
  //     destination: 'Somewhere',
  //     arrivalTime: new Date(),
  //     departure: 'Here',
  //     departureTime: new Date(),
  //     url: 'example.com',
  //   },
  // ]

  // const flights = data.map((flight: Flight, i: number) => {
  //   return (
  //     <div className="gray container box flex-row" key={i.toString()}>
  //       <div className="item">From: {flight.departure}</div>
  //       <div className="item">{flight.departureTime.toDateString()} </div>
  //       <div className="item">To: {flight.destination} </div>
  //       <div className="item">{flight.arrivalTime.toDateString()} </div>
  //       <div className="item">${flight.price.toString()} </div>
  //       <div className="item">{flight.airlines} </div>
  //       <a className="item" href={flight.url} target="_blank">
  //         link
  //       </a>
  //     </div>
  //   )
  // })

  return (
    <Fragment>
      {!loading ?
        
            data.map((flight: Flight, i: number) => {
            return (
              <div className="gray container box flex-row" key={i.toString()}>
                <div className="item">From: {flight.departure}</div>
                <div className="item">{flight.departureTime.toDateString()} </div>
                <div className="item">To: {flight.destination} </div>
                <div className="item">{flight.arrivalTime.toDateString()} </div>
                <div className="item">${flight.price.toString()} </div>
                <div className="item">{flight.airlines} </div>
                <a className="item" href={flight.url} target="_blank">
                  link
                </a>
              </div>
            )
          })
        
      :
      <div className="gray blue">loading</div>

      }
    </Fragment>
  )
}
