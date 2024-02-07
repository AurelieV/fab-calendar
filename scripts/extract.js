const rp = require('request-promise')
const cheerio = require('cheerio')
const parseDate = require('date-fns/parse')
const formatDate = require('date-fns/format')
const fs = require('fs')

const nbPage = 20
const TYPE = 107

function getOptions(page, type = '') {
  return {
    uri: `https://fabtcg.com/events/?type=${type}&query=&page=${page}`,
    useNewUrlParser: true,
    transform: function (body) {
      return cheerio.load(body)
    },
  }
}

async function scrapPage(page, type) {
  let events = []
  try {
    const $ = await rp(getOptions(page, type))
    $('.event').each(function () {
      const name = $(this)
        .find('h2')
        .text()
        .replace('Road to Nationals 2024 - Classic Constructed ', '')
        .trim()
      const country = $(this).find('i.flag').attr('title') || 'Unknown'
      const link = $(this).find('a').attr('href')

      const paragraphs = $(this).find('p')
      const rawData = $(paragraphs[0])
        .text()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length)
      const format = rawData[1]
      const rawDate = rawData[0].split(',')[0]
      const date = parseDate(rawDate, 'EEE do MMM', new Date())
      const day = parseInt(formatDate(date, 'dd'))
      const month = parseInt(formatDate(date, 'MM'))
      const address = $(paragraphs[1]).text().trim()

      events.push({ name, country, link, date: { day, month }, address, format })
    })

    console.log(`${events.length} scrapped`)
  } catch (err) {
    console.log('Error', err)
  }
  return events
}

async function scrap(type) {
  let result = []
  for (let i = 1; i <= nbPage; i++) {
    console.log(`Scrapping page ${i}`)
    const events = await scrapPage(i, type)
    result = result.concat(events)
  }
  console.log(`Finish ${result.length} tournaments extracted`)
  fs.writeFileSync('rtn-cc_2024.json', JSON.stringify(result, null, 4))
}

scrap(TYPE)
