const { chromium } = require('playwright')
const { describe, beforeEach, test, expect} = require('playwright/test')


/*
 * Verifies whether the test framework runs
 */
describe("Google", () => {
  let page
  beforeEach(async () => {
    let browser = await chromium.launch()
    page = await browser.newPage()
    await page.goto("https://google.com");
  });

  test('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch(/Google/)
  })
})
