const sgMail = require("@sendgrid/mail");
const url = require("url");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const toAndFrom = {
  from: "product-watcher@johnide.dev",
  to: "ide.johnc@gmail.com"
};

async function startedTrackingEmail(name) {
  const mailOptions = {
    ...toAndFrom,
    subject: `Product Watcher - ${name} is being tracked`,
    text: `You have started watching the ${name}.`
  };

  await sgMail.send(mailOptions);
}

async function priceUpdateEmail(
  name,
  productUrl,
  newPrice,
  oldPrice,
  lowestPrice
) {
  const source = url.parse(productUrl, true);

  const mailOptions = {
    ...toAndFrom,
    subject: `Product Watcher - ${name} price changed on ${source.host}`,
    text: `The price of the ${name} has changed on ${source.host}.

Old price: $${oldPrice}
Current price: $${newPrice}

Lowest overall tracked price: $${lowestPrice}
${
  lowestPrice >= newPrice
    ? "This is the lowest price this product has been seen since you started tracking it!\n"
    : ""
}
URL: ${productUrl}`
  };

  await sgMail.send(mailOptions);
}

async function sendRanEmail() {
  const mailOptions = {
    ...toAndFrom,
    subject: "Product Watcher",
    text:
      "Product watcher has ran. You are receiving this email as a notification that this service is working correctly."
  };

  await sgMail.send(mailOptions);
}

module.exports = {
  startedTrackingEmail,
  priceUpdateEmail,
  sendRanEmail
};
