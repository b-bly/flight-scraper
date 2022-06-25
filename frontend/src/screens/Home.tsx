import React, { Component, Fragment } from 'react'
import './Home.css'

export interface IFlight {
  price: number
  airlines: [string]
  destination: string
  arrivalTime: Date
  departure: string
  departureTime: Date
  url: string
}

interface items {
  [key: string]: string
}

export class Home extends Component {
  // constructor(props: any}) {
  //   super(props)
  //   this.state = {}
  // }

  render() {
    const exampleFlights: IFlight[] = [
      {
        price: 100,
        airlines: ['Delta'],
        destination: 'Somewhere',
        arrivalTime: new Date(),
        departure: 'Here',
        departureTime: new Date(),
        url: 'example.com',
      },
    ]
    const flights = exampleFlights.map((flight) => {
      return (
        <div className="gray container box flex-row">
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
    return <Fragment>{flights}</Fragment>
  }
}
