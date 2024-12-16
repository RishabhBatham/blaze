// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // For loading environment variables

// Create the transporter with your email service and credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail or your preferred email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email from environment variables
    pass: process.env.EMAIL_PASS, // Your password or app-specific password
  },
});

// Function to send email
async function sendEmail(userEmail, subject, message) {
    
  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`, // Sender address
    to: userEmail, // Recipient address
    subject: subject, // Subject line
    text: message, // Plain text body
    html: `<p>${message}</p>`, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

module.exports = { sendEmail };
