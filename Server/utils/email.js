const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  // CREATE TRANSPORTER
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // DEFINE THE EMAIL OPTIONS
  const mailOptions = {
    from: "SURAJ SINGH <surajsinghj1654@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    //text:
  };
  // ACTUALLY SEND THE EMAIL
  transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
