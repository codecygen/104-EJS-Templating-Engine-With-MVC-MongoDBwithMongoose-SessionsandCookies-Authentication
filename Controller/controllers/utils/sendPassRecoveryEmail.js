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
  const passResetLink = `http://localhost:3000/password_reset/${resetToken}:${resetEmail}`;

  const mailData = {
    from: process.env.EMAIL,
    to: resetEmail,
    subject: "Password Reset Request from localhost:3000",
    html: `
        <h2>Welcome to email reset request!</h2>
        <h3><a href=${passResetLink}>Click</a> here to change the password.</h3>
    `,
  };

  try {
    await transporter.sendMail(mailData);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendPassRecoveryEmail;
