if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const email = require("./email");
const s3 = require("./s3");
const scraper = require("./scraper");

const products = [
  {
    name: "LG OLED B9 55",
    urls: [
      "https://www.bestbuy.com/site/lg-55-class-oled-b9-series-2160p-smart-4k-uhd-tv-with-hdr/6360612.p?skuId=6360612",
      "https://www.amazon.com/LG-OLED55B9PUA-Ultra-Smart-OLED/dp/B07RMSJT4J/ref=sr_1_2_sspa?keywords=lg+oled+55+c9&qid=1579967128&sr=8-2-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzN041OFUyQzY1OFdLJmVuY3J5cHRlZElkPUEwMDU1ODkwMVFWVzU0UVpUR1hZQyZlbmNyeXB0ZWRBZElkPUEwMDA3MzA3M1RZRjdIWVdWSUFXQSZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU="
    ]
  },
  {
    name: "LG OLED B9 65",
    urls: [
      "https://www.bestbuy.com/site/lg-65-class-oled-b9-series-2160p-smart-4k-uhd-tv-with-hdr/6360611.p?skuId=6360611",
      "https://www.amazon.com/LG-OLED65B9PUA-Ultra-Smart-OLED/dp/B07RMSLJK5/ref=sr_1_3?crid=14AZTHYXZU8L4&keywords=lg+oled+b9+65+inch&qid=1580711656&sprefix=lg+oled+b9%2Caps%2C154&sr=8-3"
    ]
  },
  {
    name: "LG OLED C9 55",
    urls: [
      "https://www.bestbuy.com/site/lg-55-class-oled-c9pua-series-2160p-smart-4k-uhd-tv-with-hdr/6338498.p?skuId=6338498",
      "https://www.amazon.com/LG-OLED55C9PUA-Alexa-Built-Ultra/dp/B07PTN79PG/ref=sr_1_1_sspa?keywords=lg+oled+c9+55+inch&qid=1580711680&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExOEJEODRGWFNEWTRUJmVuY3J5cHRlZElkPUEwMjQ3Nzk5U1lLWjdUTU0xVlJSJmVuY3J5cHRlZEFkSWQ9QTAyMTA3MDUzNFM4NFhGVjQ4SlBIJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=="
    ]
  },
  {
    name: "LG OLED C9 65",
    urls: [
      "https://www.bestbuy.com/site/lg-65-class-oled-c9pua-series-2160p-smart-4k-uhd-tv-with-hdr/6338500.p?skuId=6338500",
      "https://www.amazon.com/LG-OLED65C9PUA-Alexa-Built-Ultra/dp/B07NHQ4CXM/ref=sr_1_1_sspa?crid=14AZTHYXZU8L4&keywords=lg+oled+b9+65+inch&qid=1580711656&sprefix=lg+oled+b9%2Caps%2C154&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyQkg0WjJGVjQwUzA5JmVuY3J5cHRlZElkPUEwOTc2OTAzQU42RkI4V1hDR0JHJmVuY3J5cHRlZEFkSWQ9QTAyODAwOTY1QUZDRjRYTzVCOEEmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl"
    ]
  },
  {
    name: "Logitech 4K Pro Webcam",
    urls: [
      "https://www.bestbuy.com/site/logitech-4k-pro-webcam/5761912.p?skuId=5761912",
      "https://www.amazon.com/Logitech-BRIO-Conferencing-Recording-Streaming/dp/B01N5UOYC4/ref=sr_1_1?keywords=logitech+4k+webcam&qid=1580760632&sr=8-1"
    ]
  },
  {
    name: "Sony a6400 with 18-135mm",
    urls: [
      "https://www.amazon.com/Sony-a6500-Mirrorless-Camera-18-135mm/dp/B07BV4CBC1/ref=sr_1_10?keywords=a6400&qid=1582519043&sr=8-10",
      "https://www.bestbuy.com/site/sony-alpha-a6400-mirrorless-camera-with-e-18-135mm-f-3-5-5-6-oss-lens-black/6324859.p?skuId=6324859"
    ]
  },
  {
    name: "Sony a6400 just body",
    urls: [
      "https://www.bestbuy.com/site/sony-alpha-a6400-mirrorless-camera-body-only-black/6324856.p?skuId=6324856",
      "https://www.amazon.com/Sony-Alpha-a6400-Mirrorless-Camera/dp/B07MTWVN3M/ref=sr_1_3?keywords=a6400&qid=1582519043&sr=8-3"
    ]
  },
  {
    name: "Sony a6400 with 16-50mm",
    urls: [
      "https://www.bestbuy.com/site/sony-alpha-a6400-mirrorless-camera-with-e-pz-16-50mm-f-3-5-5-6-oss-lens-black/6324858.p?skuId=6324858",
      "https://www.amazon.com/Sony-Alpha-a6400-Mirrorless-Camera/dp/B07MV3P7M8/ref=sr_1_6?keywords=a6400+16&qid=1582519083&sr=8-6"
    ]
  },
  {
    name: "Airpods with Charging Case",
    urls: [
      "https://www.bestbuy.com/site/apple-airpods-with-charging-case-latest-model-white/6084400.p?skuId=6084400",
      "https://www.amazon.com/Apple-AirPods-Charging-Latest-Model/dp/B07PXGQC1Q/ref=sr_1_1_sspa?keywords=airpods&qid=1585770978&sr=8-1-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFOU01SS1ZGR0tXQzMmZW5jcnlwdGVkSWQ9QTAyNzM4NzQzSEFPRktSV042OFE1JmVuY3J5cHRlZEFkSWQ9QTEwMDQ4NzBEQkJVSkxXUVYyT0wmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl&th=1"
    ]
  },
  {
    name: "Airpods with Wireless Charging Case",
    urls: [
      "https://www.bestbuy.com/site/apple-airpods-with-wireless-charging-case-latest-model-white/6083595.p?skuId=6083595",
      "https://www.amazon.com/Apple-AirPods-Charging-Latest-Model/dp/B07PYLT6DN/ref=sr_1_1_sspa?keywords=airpods&qid=1585770978&sr=8-1-spons&th=1"
    ]
  },
  {
    name: "Airpods Pro",
    urls: [
      "https://www.bestbuy.com/site/apple-airpods-pro-white/5706659.p?skuId=5706659",
      "https://www.amazon.com/Apple-MWP22AM-A-AirPods-Pro/dp/B07ZPC9QD4/ref=sr_1_2_sspa?keywords=airpods&qid=1585770978&sr=8-2-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFOU01SS1ZGR0tXQzMmZW5jcnlwdGVkSWQ9QTAyNzM4NzQzSEFPRktSV042OFE1JmVuY3J5cHRlZEFkSWQ9QTAwMDU0MTQzUkVZU1c4M0hVWkIzJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=="
    ]
  },
  {
    name: "Nintendo Switch",
    urls: [
      "https://www.bestbuy.com/site/nintendo-switch-32gb-console-neon-red-neon-blue-joy-con/6364255.p?skuId=6364255",
      "https://www.amazon.com/Nintendo-Switch-Neon-Blue-Joy%E2%80%91/dp/B07VGRJDFY/ref=sr_1_1?dchild=1&keywords=switch&qid=1585858811&sr=8-1&th=1"
    ]
  }
];

async function checkProducts() {
  const bucketExists = await s3.doesBucketExist();

  if (!bucketExists) {
    console.log("Bucket does not exist, creating...");
    await s3.createBucket();
  }

  products.forEach(async product => {
    console.log(`Checking product ${product.name}...`);

    const productExists = await s3.doesProductExist(product.name);

    if (!productExists) {
      console.log(`${product.name}.json does not exist in bucket, creating...`);
      await s3.saveProduct(product.name, product.urls);
    }

    const savedProduct = await s3.getProduct(product.name);
    const history = savedProduct.history;
    const lowestPrice = Math.min(...history.map(h => h.price));

    await Promise.all(
      product.urls.map(async url => {
        const scrapedProduct = await scraper.getProductInfo(url);
        console.log(`Found details for ${product.name}:`);
        console.log(scrapedProduct);

        const length = history.length;

        let lastHistoryForUrl = null;
        history.forEach(h => {
          if (h.url === url) {
            lastHistoryForUrl = h;
          }
        });

        if (length > 0) {
          if (lastHistoryForUrl !== null) {
            if (lastHistoryForUrl.price !== scrapedProduct.price) {
              console.log("Different prices! Adding to history.");

              history.push(scrapedProduct);

              // if (lowestPrice >= scrapedProduct.price) {
              await email.priceUpdateEmail(
                product.name,
                url,
                scrapedProduct.price,
                lastHistoryForUrl.price,
                lowestPrice
              );
              // }
            } else {
              console.log("Same price.");
            }
          } else {
            console.log(`No existing history for ${url}, adding to history.`);

            history.push(scrapedProduct);
          }
        } else {
          console.log("No existing history, adding to history.");

          history.push(scrapedProduct);

          await email.startedTrackingEmail(product.name);
        }
      })
    );

    await s3.saveProduct(product.name, product.urls, history);
  });

  // await email.sendRanEmail();
}

(async function() {
  await checkProducts();
})();
// module.exports.checkProducts = checkProducts
