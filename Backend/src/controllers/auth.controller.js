import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationOtp } from "../lib/helper.js";
import passport from "../config/passport.js";
import prisma from "../config/prisma.js";
import transporter from "../config/nodemailer.js";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Detail' });
    }

    try {
        const cleanEmail = email.trim().toLowerCase();
        const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

        if (existingUser) {
            if (existingUser.isAccountVerified) {
                return res.status(400).json({ success: false, message: "User already exists." });
            } else {
                await sendVerificationOtp(existingUser.id, existingUser.email);
                return res.status(200).json({
                    success: true,
                    redirectToVerify: true,
                    email: existingUser.email,
                    message: "Account already exists but not verified. OTP re-sent to your email.",
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email: cleanEmail, password: hashedPassword, isAccountVerified: false },
        });

        await sendVerificationOtp(user.id, user.email);

        return res.status(201).json({
            success: true,
            redirectToVerify: true,
            message: `OTP email sent successfully to ${cleanEmail}`,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    try {
        const cleanEmail = email.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (!user) {
            return res.status(401).json({ success: false, message: "User does't exists invalid email." });
        }

        if (!user.isAccountVerified) {
            return res.status(401).json({ success: false, message: "Login failed! Please verify your email first", });
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ message: "Invalid Password." });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({ success: true, message: "Login successful!" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return res.json({ success: true, message: "Logged out successfully." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.user;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        await sendVerificationOtp(user.id, user.email);

        return res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (err) {
        console.log("Otp Send Error:", err);
        res.status(500).json({ success: false, message: "Server error while sending OTP." });
    }
};

export const verifyEmail = async (req, res) => {
    const { otp, email } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp !== otp || user.verifyOtpExpireAt < Math.floor(Date.now() / 1000)) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isAccountVerified: true,
                verifyOtp: "",
                verifyOtpExpireAt: 0,
            },
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const mailOption = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: "Welcome to Demo App – Your Account Is Verified!",
            html: `<div>Hi ${user.name || user.email}, your email is verified successfully!</div>`,
        };

        await transporter.sendMail(mailOption);

        return res.status(200).json({ success: true, message: "Email verified successfully!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server error while verifying email." });
    }
};

export const isauth = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "User is authenticated", user: req.user });
    } catch (err) {
        console.log("Auth error : ", err);
        return res.status(500).json({ success: false, message: "Auth function errror" });
    }
}

export const sendPasswordResetLink = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required", success: false });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const resetTokenExpireAt = Math.floor(Date.now() / 1000) + 60 * 60;

        await prisma.user.update({
            where: { email: email },
            data: {
                resetOtp: token,
                resetOtpExpireAt: resetTokenExpireAt,
            }
        })

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const mailOption = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: "Password Reset Link",
            html: `<div style="font-family: Comic Relief; line-height: 1.5;">
                  <h2>Password Reset Request</h2>
                  <p>Hello ${user.name || "User"},</p>
                  <p>You requested to reset your password. Click the link below to reset it:</p>
                  <a href="${resetLink}" style="background:#4CAF50;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
                  <p>This link will expire in <b>1 hour</b>.</p>
                  <p>If you didn’t request this, you can safely ignore this email.</p>
                </div>`,
        }

        await transporter.sendMail(mailOption);

        return res.status(200).json({ success: true, message: "Password reset link sent to your email." });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server error while sending reset link" });
    }
}

export const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    try {
        const user = await prisma.user.findFirst({ where: { resetOtp: token } });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired reset link" });
        }

        if (user.resetOtpExpireAt < Math.floor(Date.now() / 1000)) {
            return res.status(400).json({ success: false, message: "Reset link expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetOtp: "",
                resetOtpExpireAt: 0,
            }
        })

        return res.status(200).json({ message: "Password has been reset succesfully", success: true });
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const { userId } = req.user;
        if (!userId) return res.status(401).json({ success: false, message: "UserId is missing" });

        await prisma.paymentHistory.deleteMany({ where: { userId } });
        await prisma.userProfile.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
        });

        return res.status(200).json({ success: true, message: "Account deleted successfully" });
    }
    catch (error) {
        console.log("deleteAccount error:", error);
        res.status(500).json({ success: false, message: "Something went wrong while deleting account" });
    }
}

export const googleLogin = async (req, res, next) => {
    try {
        passport.authenticate("google", { session: false }, async (err, user) => {
            if (err || !user) {
                console.error("Google authentication failed:", err);
                return res.redirect(`${process.env.FRONTEND_URL}/login`);
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.redirect(`${process.env.FRONTEND_URL}/`);
        })(req, res, next);
    } catch (error) {
        console.error("Google Login Error:", error);
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
};

export const githubLogin = async (req, res, next) => {
    try {
        passport.authenticate("github", { session: false }, async (err, user) => {
            if (err || !user) {
                console.error("GitHub authentication failed:", err);
                return res.redirect(`${process.env.FRONTEND_URL}/login`);
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.redirect(`${process.env.FRONTEND_URL}/`);
        })(req, res, next);
    } catch (error) {
        console.error("GitHub Login Error:", error);
        return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
};
