const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const moment = require("moment");

async function fetchData(url) {
  const result = await axios.get(url);
  return cheerio.load(result.data);
}

async function getProductInfo(productURL) {
  const $ = await fetchData(productURL);

  const source = url.parse(productURL, true);

  let product = {};

  switch (source.host) {
    case "www.amazon.com": {
      product = amazon($);
      break;
    }
    case "www.bestbuy.com": {
      product = bestBuy($);
      break;
    }
    default:
      throw Error(`host scraping not implemented: ${source.host}`);
  }

  return product;
}

function amazon($) {
  const product = {
    date: moment().toString(),
    price: null
  };

  product.price = parseFloat(
    $("#priceblock_ourprice")
      .text()
      .substring(1)
      .replace(",", "")
  );

  if (isNaN(product.price)) {
    product.price = parseFloat(
      $("#priceblock_saleprice")
        .text()
        .substring(1)
        .replace(",", "")
    );
  }

  return product;
}

function bestBuy($) {
  const product = {
    date: moment().toString(),
    price: null
  };

  product.price = parseFloat(
    $(".priceView-hero-price > span:first-child")
      .text()
      .substring(1)
      .replace(",", "")
  );

  return product;
}

module.exports = {
  getProductInfo
};
