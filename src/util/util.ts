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
