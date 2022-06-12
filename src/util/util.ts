import { MAX_RETRIES } from './constants'
import type { Page } from 'puppeteer'
import logger from './logger'
import csv from 'csv-parser' // const csv = require('csv-parser');
import { createReadStream } from 'fs'

export const sleep = async (seconds: number) =>
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))

export const retry = async (
  block: Function,
  parameter: string,
  maxRetries = MAX_RETRIES,
  time = 1000
) => {
  let counter = 0
  let condition = false
  let el
  while (!condition && counter++ < maxRetries) {
    try {
      el = await block(parameter)
      // el
      condition = true
    } catch (e) {
      logger.debug('retrying')
      await new Promise((resolve) => setTimeout(resolve, time))
    }
  }
  if (!el) {
    console.log("Couldn't get element")
  }
}

export const retryClick = async (
  page: Page,
  parameter: string,
  maxRetries = MAX_RETRIES,
  time = 1000
) => {
  let counter = 0
  let condition = false
  let el
  while (!condition && counter++ < maxRetries) {
    try {
      el = await page.waitForSelector(parameter)
      await el.click()
      // el
      condition = true
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, time))
    }
  }
  if (!el) {
    console.log("Couldn't get element")
  }
}

export const getJsonFromCsv = async (
  url: string,
  cb?: () => void
): Promise<any[]> => {
  const data: any[] = []
  return new Promise((resolve, reject) => {
    createReadStream(url)
      .on('error', () => {
        console.log('error')
        reject()
      })
      .pipe(csv())
      .on('data', (row: any) => {
        data.push(row)
      })
      .on('end', () => {
        resolve(data)
      })
    if (cb) {
      cb()
    }
  })
}

export const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const convertTo24 = (time12: string, amPm: string) => {
  time12 = time12.trim()
  if (amPm.trim().toLowerCase() === 'pm') {
    const hours = time12.match(/\d+/)[0]
    const minutes = time12.match(/\d+/g)[1]
    const hours24 = (parseInt(hours) + 12).toString() + ':' + minutes
    return hours24
  }
  return time12
}
