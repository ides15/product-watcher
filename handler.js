require("dotenv").config();
const email = require("./email");
const s3 = require("./s3");
const scraper = require("./scraper");

const products = [
  {
    name: "Best Buy LG B9 55",
    url:
      "https://www.bestbuy.com/site/lg-55-class-oled-b9-series-2160p-smart-4k-uhd-tv-with-hdr/6360612.p?skuId=6360612"
  },
  {
    name: "Amazon LG B9 55",
    url:
      "https://www.amazon.com/LG-OLED55B9PUA-Ultra-Smart-OLED/dp/B07RMSJT4J/ref=sr_1_2_sspa?keywords=lg+oled+55+c9&qid=1579967128&sr=8-2-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzN041OFUyQzY1OFdLJmVuY3J5cHRlZElkPUEwMDU1ODkwMVFWVzU0UVpUR1hZQyZlbmNyeXB0ZWRBZElkPUEwMDA3MzA3M1RZRjdIWVdWSUFXQSZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU="
  },
  {
    name: "Best Buy LG B9 65",
    url:
      "https://www.bestbuy.com/site/lg-65-class-oled-b9-series-2160p-smart-4k-uhd-tv-with-hdr/6360611.p?skuId=6360611"
  },
  {
    name: "Best Buy LG C9 65",
    url:
      "https://www.bestbuy.com/site/lg-65-class-oled-c9pua-series-2160p-smart-4k-uhd-tv-with-hdr/6338500.p?skuId=6338500"
  },
  {
    name: "Best Buy LG C9 55",
    url:
      "https://www.bestbuy.com/site/lg-55-class-oled-c9pua-series-2160p-smart-4k-uhd-tv-with-hdr/6338498.p?skuId=6338498"
  },
  {
    name: "Amazon LG B9 65",
    url:
      "https://www.amazon.com/LG-OLED65B9PUA-Ultra-Smart-OLED/dp/B07RMSLJK5/ref=sr_1_3?crid=14AZTHYXZU8L4&keywords=lg+oled+b9+65+inch&qid=1580711656&sprefix=lg+oled+b9%2Caps%2C154&sr=8-3"
  },
  {
    name: "Amazon LG C9 65",
    url:
      "https://www.amazon.com/LG-OLED65C9PUA-Alexa-Built-Ultra/dp/B07NHQ4CXM/ref=sr_1_1_sspa?crid=14AZTHYXZU8L4&keywords=lg+oled+b9+65+inch&qid=1580711656&sprefix=lg+oled+b9%2Caps%2C154&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyQkg0WjJGVjQwUzA5JmVuY3J5cHRlZElkPUEwOTc2OTAzQU42RkI4V1hDR0JHJmVuY3J5cHRlZEFkSWQ9QTAyODAwOTY1QUZDRjRYTzVCOEEmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl"
  },
  {
    name: "Amazon LG C9 55",
    url:
      "https://www.amazon.com/LG-OLED55C9PUA-Alexa-Built-Ultra/dp/B07PTN79PG/ref=sr_1_1_sspa?keywords=lg+oled+c9+55+inch&qid=1580711680&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExOEJEODRGWFNEWTRUJmVuY3J5cHRlZElkPUEwMjQ3Nzk5U1lLWjdUTU0xVlJSJmVuY3J5cHRlZEFkSWQ9QTAyMTA3MDUzNFM4NFhGVjQ4SlBIJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=="
  },
  {
    name: "Best Buy Logitech 4K Pro Webcam",
    url:
      "https://www.bestbuy.com/site/logitech-4k-pro-webcam/5761912.p?skuId=5761912"
  },
  {
    name: "Amazon Logitech 4K Pro Webcam",
    url:
      "https://www.amazon.com/Logitech-BRIO-Conferencing-Recording-Streaming/dp/B01N5UOYC4/ref=sr_1_1?keywords=logitech+4k+webcam&qid=1580760632&sr=8-1"
  }
];

async function checkProducts() {
  const bucketExists = await s3.doesBucketExist();

  if (!bucketExists) {
    console.log("Bucket does not exist, creating...");
    await s3.createBucket();
  }

  products.map(async product => {
    console.log(`Checking product ${product.name}...`);

    const productExists = await s3.doesProductExist(product.name);

    if (!productExists) {
      console.log(`${product.name}.json does not exist in bucket, creating...`);
      await s3.saveProduct(product.name, product.url);
    }

    const savedProduct = await s3.getProduct(product.name);
    const scrapedProduct = await scraper.getProductInfo(product.url);
    console.log(`Found details for ${product.name}:`);
    console.log(scrapedProduct);

    const lowestPrice = Math.min(...savedProduct.history.map(h => h.price));
    const history = savedProduct.history;
    const length = history.length;

    if (length > 0) {
      if (history[length - 1].price !== scrapedProduct.price) {
        console.log("Different prices! Adding to history.");

        history.push(scrapedProduct);

        await s3.saveProduct(product.name, product.url, history);
        await email.priceUpdateEmail(
          product.name,
          product.url,
          scrapedProduct.price,
          history[length - 1].price,
          lowestPrice
        );
      } else {
        console.log("Same price.");
        // await email.priceUpdateEmail(
        //   product.name,
        //   product.url,
        //   scrapedProduct.price,
        //   history[length - 1].price,
        //   lowestPrice
        // );
      }
    } else {
      console.log("No existing history, adding to history.");
      await s3.saveProduct(product.name, product.url, [scrapedProduct]);
      await email.startedTrackingEmail(
        product.name,
        product.url,
        scrapedProduct.price
      );
    }
  });
}

(async function() {
  await checkProducts();
})();
// module.exports.checkProducts = checkProducts
