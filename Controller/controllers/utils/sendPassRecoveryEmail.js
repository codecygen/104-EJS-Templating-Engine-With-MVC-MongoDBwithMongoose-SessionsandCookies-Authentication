const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Zoho",
  host: "stp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendPassRecoveryEmail = async (resetEmail, resetToken) => {
  const passResetLink = `localhost:3000/password_reset/${resetToken}:${resetEmail}`;

  const mailConfig = {
    from: process.env.EMAIL,
    to: resetEmail,
    subject: "Password Reset Request from localhost:3000",
    html: `
        <p>This is our test email!</p>
    `,
  };

  try {
    await transporter.sendMail(mailConfig);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendPassRecoveryEmail;
