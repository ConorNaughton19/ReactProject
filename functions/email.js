const nodemailer = require("nodemailer");
const functions = require("firebase-functions");

const email = functions.config().email.email;
const password = functions.config().email.password;

const createtransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: email,
    pass: password,
  },
});

module.exports = transporter;
