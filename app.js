const express = require('express')
const app = express()

app.get('/', function (req, res) {
  const puppeteer = require('puppeteer');
  (async() => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    const page = await browser.newPage()
    await page.goto('https://www.rottentomatoes.com/browse/cf-in-theaters/', {waitUntil: 'networkidle2'})
    // Type our query into the search bar

    // Wait for the results to show up
    await page.waitForSelector('h3.movieTitle')

    // // Extract the results from the page
    const movies = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('h3.movieTitle'))
      return anchors.map((anchor) => {
        return anchor.textContent.split('(')[0].trim()
      })
    })
    browser.close()
    res.json(movies)
  })()
})

app.listen(5000, function () {
})
