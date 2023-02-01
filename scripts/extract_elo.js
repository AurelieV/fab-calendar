const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')

const nbPage = 195
const mode = 'elo_lim'

function getOptions(page, mode = '') {
  return {
    uri: `https://fabtcg.com/leaderboards/?mode=${mode}&query=&page=${page}`,
    useNewUrlParser: true,
    transform: function (body) {
      return cheerio.load(body)
    },
  }
}

async function scrapPage(page, type) {
  let players = []
  try {
    const $ = await rp(getOptions(page, type))
    $('tr').each(function () {
      if ($(this).find('th').length) {
        return
      }
      const cells = $(this).find('td')
      const rank = parseInt($(cells[0]).text().trim())
      const elo = parseInt($(cells[3]).text().trim())
      const country = $(cells[1]).find('i.flag').attr('title')
      const countryShort = $(cells[1]).find('i.flag').attr('class').split(' ')[0]
      const rawName = $(cells[2]).text().trim()
      const [, name, gameId] = rawName.match(/^(.+) \((\d+)\)$/)

      players.push({ rank, country, countryShort, elo, name: name, gameId })
    })

    console.log(`${players.length} scrapped`)
  } catch (err) {
    console.log('Error', err)
  }
  return players
}

async function scrap(type) {
  let result = []
  for (let i = 1; i <= nbPage; i++) {
    console.log(`Scrapping page ${i}`)
    const players = await scrapPage(i, type)
    result = result.concat(players)
  }
  console.log(`Finish ${result.length} players extracted`)
  fs.writeFileSync('players-elo-limited-17-01-2023.json', JSON.stringify(result, null, 4))
}

function convert() {
  const data = require('./players-elo-constructed-17-01-2023.json')
  let csv = data
    .map(
      (line) =>
        `${line.rank};${line.name};${line.gameId};${line.elo};${line.country};${line.countryShort};`
    )
    .join('\n')
  csv = `rank;name;gameId;elo;country;countryCode;\n${csv}`
  fs.writeFileSync('players-elo-constructed-17-01-2023.csv', csv)
}

convert()

// scrap(mode)
