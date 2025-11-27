import express from "express";
import { login, signup, logout, sendVerifyOtp, verifyEmail, isauth, resetPassword, deleteAccount, googleLogin, sendPasswordResetLink, githubLogin } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { strictLimiter } from "../lib/limiter.js";
import passport from "../config/passport.js";

const router = express.Router();

router.post("/login", strictLimiter, login);
router.post("/signup", strictLimiter, signup);
router.post("/logout", authMiddleware, logout);
router.post("/send-verify-otp", sendVerifyOtp);
router.patch("/verify-account", verifyEmail);
router.get("/is-auth", authMiddleware, isauth);
router.post("/send-reset-link", sendPasswordResetLink);
router.patch("/reset-password/:token", resetPassword);
router.delete("/delete-account", authMiddleware, deleteAccount);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback", googleLogin);
router.get("/github", passport.authenticate("github", { scope: ["profile", "email"], session: false }));
router.get("/github/callback", githubLogin);

export default router;
