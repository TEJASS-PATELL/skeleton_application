import prisma from "../config/prisma.js";
import transporter from "../config/nodemailer.js";

//* this code send verification otp to user email
export const sendVerificationOtp = async (userId, userEmail) => {
  try {
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    await prisma.user.update({
      where: { id: userId },
      data: {
        verifyOtp: otp,
        verifyOtpExpireAt: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      },
    });

    const mailOption = {
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: "Verify Your Account – OTP Code Inside",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <h2 style="color: #2563eb;">Verify Your Account</h2>
          <p>Hi <strong>${userEmail}</strong>,</p>
          <p>Please use the following One-Time Password (OTP) to verify your account:</p>
          <div style="text-align: center; margin: 25px 0;">
            <span style="display: inline-block; font-size: 22px; letter-spacing: 4px; color: #111; font-weight: bold; background: #e0e7ff; padding: 10px 20px; border-radius: 6px;">
              ${otp}
            </span>
          </div>
          <p>This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone.</p>
        </div>`,
    };

    await transporter.sendMail(mailOption);
  } catch (err) {
    console.error("sendVerificationOtp error:", err);
  }
};
