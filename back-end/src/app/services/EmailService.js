const nodemailer = require("nodemailer");
require("dotenv").config();

const user_email = process.env.EMAIL_USER;
const user_password = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: user_email,
    pass: user_password,
  },
});

async function sendEmail(to, subject, text) {
  try {
    const mailOptions = {
      from: '"Manga Website" <heolunkutu@gmail.com>',
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = { sendEmail };
