import React from 'react'
import logo from './logo.svg'
import './App.css'
import { Home } from './screens/Home'

function App() {
  return (
    <div className="flex-column blue parent-container">
      <div className="nav flex-row container orange">
        <h3 className="text-white">Search results</h3>
      </div>
      <Home />
    </div>
  )
}

export default App
