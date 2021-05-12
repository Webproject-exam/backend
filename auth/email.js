const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const smtpTransport = require('nodemailer-smtp-transport');

require('dotenv').config();

exports.smtpTrans = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
        user: process.env.EMAIL_CREDENTIALS,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.CLIENT_REFRESH_TOKEN,
        accessToken: process.env.CLIENT_ACCESS_TOKEN,
        expires_in: 1784314697598,
      }),
    },
  })
);

if (process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  exports.getPasswordResetUrl = (user, token) =>
    `${process.env.BACKEND_URL}/reset_password/reset/${user._id}/${token}`;
} else {
  exports.getPasswordResetUrl = (user, token) =>
    `http://localhost:${process.env.PORT}/reset_password/reset/${user._id}/${token}`;
}

exports.resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_CREDENTIALS;
  const to = user.email;
  const subject = 'Reset password';
  const html = `
  <p>Hey ${user.name || user.email},</p>
  <p>This is a noreply email where you can reset password</p>
  <p>URL will expire in one hour</p>
  <a href=${url}>${url}</a>
  <p>Best regards,</p>
  <p>Fullstack project team</p>
  `;
  return { from, to, subject, html };
};

exports.sendEmailToGardernersTemplate = (emailsArray, url) => {
  const from = process.env.EMAIL_CREDENTIALS;
  const to = emailsArray;
  const subject = 'Someone has requested plant care';

  const html = `
  <p>Hello all gardeners</p>
  <p>This is a noreply email, somebody has just requested watering</p>
  <p>Plant url is here ${url}</p>
  <p>Best regards,</p>
  <p>Managers</p>
  `;
  return { from, to, subject, html };
};
