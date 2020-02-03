const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ide.johnc@gmail.com",
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendEmail(name, url, newPrice, oldPrice) {
  const newHistoryEmail = {
    subject: `Product Watcher - ${name} is being tracked`,
    text: `You have started watching the ${name}.\n\nCurrent price: $${newPrice}\n\nURL: ${url}`
  };

  const existingHistoryEmail = {
    subject: `Product Watcher - ${name} price changed`,
    text: `The price of the ${name} has changed.\n\nOld price: $${oldPrice}\n\nCurrent price: $${newPrice}\n\nURL: ${url}`
  };

  const contents = oldPrice ? existingHistoryEmail : newHistoryEmail;

  const mailOptions = {
    from: "ide.johnc@gmail.com",
    to: "ide.johnc@gmail.com",
    ...contents
  };

  await transporter.sendMail(mailOptions);
}

async function sendRanEmail() {
  const mailOptions = {
    from: "ide.johnc@gmail.com",
    to: "ide.johnc@gmail.com",
    subject: "Product Watcher",
    text:
      "Product watcher has ran. You are receiving this email as a notification that this service is working correctly."
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendEmail,
  sendRanEmail
};
