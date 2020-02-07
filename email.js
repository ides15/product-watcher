const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ide.johnc@gmail.com",
    pass: process.env.EMAIL_PASSWORD
  }
});

const toAndFrom = {
  from: "ide.johnc@gmail.com",
  to: "ide.johnc@gmail.com"
};

async function startedTrackingEmail(name, url, price) {
  const mailOptions = {
    ...toAndFrom,
    subject: `Product Watcher - ${name} is being tracked`,
    text: `You have started watching the ${name}.

Current price: $${price}

URL: ${url}`
  };

  await transporter.sendMail(mailOptions);
}

async function priceUpdateEmail(name, url, newPrice, oldPrice, lowestPrice) {
  const mailOptions = {
    ...toAndFrom,
    subject: `Product Watcher - ${name} price changed`,
    text: `The price of the ${name} has changed.

Old price: $${oldPrice}
Current price: $${newPrice}

Lowest tracked price: $${lowestPrice}
${
  lowestPrice >= newPrice
    ? "This is the lowest price this product has been seen since you started tracking it!\n"
    : ""
}
URL: ${url}`
  };

  await transporter.sendMail(mailOptions);
}

async function sendRanEmail() {
  const mailOptions = {
    ...toAndFrom,
    subject: "Product Watcher",
    text:
      "Product watcher has ran. You are receiving this email as a notification that this service is working correctly."
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  startedTrackingEmail,
  priceUpdateEmail,
  sendRanEmail
};
