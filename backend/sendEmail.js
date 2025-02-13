const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
dotenv.config();


const logoPath = path.join(__dirname, '..', 'frontend', 'public', 'logo.png');
// Check if the logo file exists
if (!fs.existsSync(logoPath)) {
  console.error('Logo file does not exist:', logoPath);
} else {
  console.log('Logo file exists:', logoPath);
}
const Logo = {
  filename: 'logo.png',
  path: logoPath,
  cid: 'logo@drbillerz.ca'
};

const transporter = nodemailer.createTransport({
  host: process.env.smtpHost,
  port: 465,
  secure: true,
  // service: 'gmail',
  auth: {
    user: process.env.smtpEmail,
    pass: process.env.smtpPassword,
  },
});

const SendEmail = (To, Subject, Body, cb) => {
  const mailOptions = {
    from: process.env.smtpEmail,
    to: To,
    subject: Subject,
    html: Body,
    attachments: [
      Logo,
    ]
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      cb(error, null);
    } else {
      console.log("Email sent: " + info.response);
      cb(null, info);
    }
  });
};

const SendEmailAsync = async (To, Subject, Body) => {
  const mailOptions = {
    from: process.env.smtpEmail,
    to: To,
    subject: Subject,
    html: Body,
    attachments: [
      Logo,
    ],
  };

  // Send the email asynchronously
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  SendEmail,
  SendEmailAsync
};
