import { Browser } from 'puppeteer'
import puppeteer from 'puppeteer'

export default class Runner {
  constructor(private options: {}) {}

  async start() {
    const options = {
      headless: false
    }
    const browser = await puppeteer.launch(options);  
    const page = await browser.newPage();
    await page.goto('https://example.com');
    await page.screenshot({ path: 'example.png' });
    await page.close();
    await browser.close();
  }
}
