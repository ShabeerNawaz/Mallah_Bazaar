const nodemailer = require("nodemailer");

// Reuses one transporter for the whole app instead of creating one per email.
// Works with Gmail using an App Password (not your normal login password):
// https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fails loudly at startup if email creds are missing/wrong, instead of
// silently failing the first time an order comes in.
transporter.verify((err) => {
  if (err) {
    console.warn("Email transporter not ready:", err.message);
  } else {
    console.log("Email transporter ready to send notifications");
  }
});

module.exports = transporter;
