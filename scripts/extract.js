const rp = require("request-promise");
const cheerio = require("cheerio");
const parseDate = require("date-fns/parse");
const formatDate = require("date-fns/format");
const fs = require("fs");

const nbPage = 18;

function getOptions(page) {
    return {
        uri: `https://fabtcg.com/events/?format=&type=18&query=&page=${page}&mode=event`,
        useNewUrlParser: true,
        transform: function (body) {
            return cheerio.load(body);
        },
    };
}

async function scrapPage(page) {
    let events = [];
    try {
        const $ = await rp(getOptions(page));
        $(".event").each(function () {
            const name = $(this).find("h2").text().replace("Pro Quest", "").trim();
            const country = $(this).find("i.flag").attr("title");
            const link = $(this).find("a").attr("href");

            const paragraphs = $(this).find("p");
            const rawData = $(paragraphs[0]).text().split("\n")[1].trim().split(",")[0];
            const date = parseDate(rawData, "EEE do MMM", new Date());
            const day = parseInt(formatDate(date, "dd"));
            const month = parseInt(formatDate(date, "MM"));
            const address = $(paragraphs[1]).text().trim();

            events.push({ name, country, link, date: { day, month }, address });
        });

        console.log(`${events.length} scrapped`);
    } catch (err) {
        console.log("Error", err);
    }
    return events;
}

async function scrap() {
    let result = [];
    for (let i = 1; i <= nbPage; i++) {
        console.log(`Scrapping page ${i}`);
        const events = await scrapPage(i);
        result = result.concat(events);
    }
    console.log(`Finish ${result.length} tournaments extracted`);
    fs.writeFileSync("tournaments.json", JSON.stringify(result, null, 4));
}

scrap();
