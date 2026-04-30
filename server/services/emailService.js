const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminderEmail = async (email, taskTitle, username) => {
  const mailOptions = {
    from: `"__asit.0.___" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Reminder: Task "${taskTitle}" is due soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4F46E5;">__asit.0.___ Task Manager</h2>
        <p>Hello <strong style="color: #EC4899;">${username}</strong>,</p>
        <p>This is a quick reminder that your task <strong>"${taskTitle}"</strong> is coming up soon.</p>
        <p>Please log in to your dashboard to check your schedule.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>__asit.0.___ Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email} for task: ${taskTitle}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
  }
};

const sendOTPEmail = async (email, otp, username) => {
  const mailOptions = {
    from: `"__asit.0.___" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your OTP for __asit.0.___ Task Manager`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #4F46E5;">__asit.0.___ Task Manager</h2>
        <p>Hello <strong style="color: #EC4899;">${username}</strong>,</p>
        <p>Thank you for registering! Please use the following One-Time Password (OTP) to verify your email address. It will expire in 10 minutes.</p>
        <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px;">
          ${otp}
        </div>
        <br/>
        <p>Best regards,</p>
        <p><strong>__asit.0.___ Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${email}:`, error);
  }
};

module.exports = { sendReminderEmail, sendOTPEmail };
