const nodemailer = require('nodemailer');

require('dotenv').config();

exports.transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.CLIENT_REFRESH_TOKEN,
  },
});

if (process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  exports.getPasswordResetUrl = (user, token) =>
    `${process.env.BACKEND_URL}/reset_password/reset/${user._id}/${token}`;
} else {
  exports.getPasswordResetUrl = (user, token) =>
    `http://localhost:${process.env.PORT}/reset_password/reset/${user._id}/${token}`;
}

exports.resetPasswordTemplate = (user, url) => {
  const from = process.env.EMAIL_LOGIN;
  const to = user.email;
  const subject = 'Noreply Simple reset password';
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
  const from = process.env.EMAIL_LOGIN;
  const to = emailsArray;
  const subject = 'Noreply Simple careplant email here';

  const html = `
  <p>Hello all gardeners</p>
  <p>This is a noreply email, somebody has just requested watering</p>
  <p>Plant url is here ${url}</p>
  <p>Best regards,</p>
  <p>Managers</p>
  `;
  return { from, to, subject, html };
};
