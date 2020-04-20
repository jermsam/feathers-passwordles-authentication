/* eslint-disable no-console */

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */



module.exports = {
  sendMyMail: async (options, mailOptions)=> {
    try {
      const { user, clientId, clientSecret, refreshToken,
      } = options;
      const oauth2Client = new OAuth2(
        clientId,
        clientSecret,
        'https://developers.google.com/oauthplayground' // Redirect URL
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { res } = await oauth2Client.getAccessToken();

      const { access_token, expiry_date } = res.data;

      const expires = expiry_date;
      const accessToken = access_token;

      const auth =  {
        type: 'OAuth2',
        user,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
        expires,
      };

      const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth,
        tls: {
          rejectUnauthorized: false, // do away with sendmail error : self signed certificate
        },
      });
      return smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
      });
    } catch ({ message }) {
      console.log('Error: ', message);
    }
  },
};
