import type { Page } from "puppeteer"
// import { sleep, retry, retryClick } from "../util/util"
// import logger from "../util/logger"
import SearchPage from "./searchPage"

// TODO namespace

export default class SearchResultsPage extends SearchPage {
  path: string = "/flights"

  constructor(page: Page) {
    super(page)
  }
}
