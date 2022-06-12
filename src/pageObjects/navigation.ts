import { Page } from 'puppeteer'

namespace NavigationConstants {
  export const MENU = '[aria-label="Menu"]'
}

export default class Navigation {
  constructor(protected page: Page) {}

  async getMenu() {
    return await this.page.waitForSelector(NavigationConstants.MENU)
  }
}
