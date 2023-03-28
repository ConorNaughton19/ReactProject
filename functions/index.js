const nodemailer = require("nodemailer");
const {google} = require("googleapis");

const CLIENT_ID = "1068142968031-26vpfdnjm13ecml0lgrd6visr53h84e1.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "https://oauth2.googleapis.com/token";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

/**
 * Creates an email transporter using OAuth2 authentication.
 * @return {Promise<nodemailer.Transporter>} A Promise that resolves to an email transporter object.
 */
async function createTransporter() {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "DiaHealthStaff@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  return transporter;
}

module.exports = createTransporter;
