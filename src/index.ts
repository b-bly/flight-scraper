import Runner from './runner'
// const express = require('express')
import  express, { Request, Response }from 'express'
import './models/flight'

const fs = require('fs')
const existsSync = fs.existsSync
const path = require('path')
const { exec } = require("child_process");

const options = {
  headless: false,
}

// TODO Uncomment when db and server are done
// const runner = new Runner(options)
// runner.start()

const app = express()
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', (_req: Request, res: Response) => {
  res.send('hello')
})
