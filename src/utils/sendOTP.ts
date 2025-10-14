import nodemailer from "nodemailer";

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Mock Miya" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code - Mock Miya",
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50; text-align: center;">Mock Miya</h2>
        <p>Hi,</p>
        <p>We've received a request to verify your email. Please use the OTP below to complete your verification:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 24px; letter-spacing: 5px; padding: 10px 20px; border-radius: 5px; background-color: #4CAF50; color: #fff;">
            ${otp}
          </span>
        </div>
        <p>This OTP will expire in <b>10 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">
          © 2025 Mock Miya. All rights reserved.
        </p>
      </div>
    `,
  });
};
