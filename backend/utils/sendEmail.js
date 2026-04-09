const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // 1. Use explicit host and port settings instead of just 'service: gmail'
    // This provides better compatibility and reliability on platforms like Render.
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // In production proxies, sometimes you need to relax TLS (use caution if highly sensitive, but often required on Render/Vercel)
      tls: {
        rejectUnauthorized: false
      }
    });

    // 2. Wrap sendMail in an explicit Promise if you prefer, or just await it.
    // Nodemailer supports Promises out of the box when no callback is passed.
    const info = await transporter.sendMail({
      from: `"ShareBite" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully! Message ID:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Detailed Email Sending Error:");
    console.error("  - Error Name:", error.name);
    console.error("  - Error Message:", error.message);
    if (error.responseCode) console.error("  - SMTP Response Code:", error.responseCode);
    if (error.command) console.error("  - Failed Command:", error.command);
    
    // Propagate the error so the controller knows the email failed
    throw error;
  }
};

module.exports = sendEmail;