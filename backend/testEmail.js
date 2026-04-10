require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const testSender = async () => {
  try {
    console.log("Testing email configuration...");
    await sendEmail({
      to: process.env.EMAIL_USER, // sending to yourself
      subject: 'ShareBite Production Email Test',
      html: '<h1>It Works!</h1><p>The SMTP configuration is fully functional locally.</p>'
    });
    console.log("Test script completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Test script failed:", error);
    process.exit(1);
  }
};

testSender();
