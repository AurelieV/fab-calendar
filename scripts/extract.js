const rp = require('request-promise')
const cheerio = require('cheerio')
const parseDate = require('date-fns/parse')
const formatDate = require('date-fns/format')
const fs = require('fs')

const nbPage = 10
const TYPE = 52

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
      const name = $(this).find('h2').text().replace('Road to Nationals 2022 - ', '').trim()
      const country = $(this).find('i.flag').attr('title')
      const link = $(this).find('a').attr('href')

      const paragraphs = $(this).find('p')
      const rawData = $(paragraphs[0]).text().split('\n')[1].trim().split(',')[0]
      const date = parseDate(rawData, 'EEE do MMM', new Date())
      const day = parseInt(formatDate(date, 'dd'))
      const month = parseInt(formatDate(date, 'MM'))
      const address = $(paragraphs[1]).text().trim()

      events.push({ name, country, link, date: { day, month }, address })
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
  fs.writeFileSync('rtn-draft-2022.json', JSON.stringify(result, null, 4))
}

scrap(TYPE)
