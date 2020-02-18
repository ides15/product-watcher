const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const moment = require("moment");

const chromeUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36";

async function fetchData(url) {
  const result = await axios({
    method: "GET",
    url
    // headers: {
    //   "User-Agent": chromeUserAgent
    // }
  });

  console.log(result.status);
  return cheerio.load(result.data);
}

async function getProductInfo(productURL) {
  const $ = await fetchData(productURL);

  const source = url.parse(productURL, true);

  let price;

  switch (source.host) {
    case "www.amazon.com": {
      price = amazon($);
      break;
    }
    case "www.bestbuy.com": {
      price = bestBuy($);
      break;
    }
    default:
      throw Error(`host scraping not implemented: ${source.host}`);
  }

  return {
    date: moment().toString(),
    url: productURL,
    price
  };
}

function amazon($) {
  let price;

  price = parseFloat(
    $("#priceblock_ourprice")
      .text()
      .substring(1)
      .replace(",", "")
  );

  if (Number.isNaN(price)) {
    price = parseFloat(
      $("#priceblock_saleprice")
        .text()
        .substring(1)
        .replace(",", "")
    );
  }

  if (Number.isNaN(price) || price === null) {
    throw new Error(`price was not scraped successfully: ${price}`);
  }

  return price;
}

function bestBuy($) {
  let price;

  price = parseFloat(
    $(".priceView-hero-price > span:first-child")
      .text()
      .substring(1)
      .replace(",", "")
  );

  if (Number.isNaN(price) || price === null) {
    throw new Error(`price was not scraped successfully: ${price}`);
  }

  return price;
}

(async () => {
  console.log(
    await getProductInfo(
      "https://www.bestbuy.com/site/lg-55-class-oled-b9-series-2160p-smart-4k-uhd-tv-with-hdr/6360612.p?skuId=6360612"
    )
  );
})();

module.exports = {
  getProductInfo
};
