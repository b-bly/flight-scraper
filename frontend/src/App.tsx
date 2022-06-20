import React from 'react';
import logo from './logo.svg';
import './App.css'
import { Home } from './screens/Home'

function App() {
  return (
    <div className="flex-column blue container">
      <h3>Search results</h3>
      <Home />
    </div>
  );
}

export default App;
