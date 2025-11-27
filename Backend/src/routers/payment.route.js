import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { payment, verifyPaymentSession, premiumAccess } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", authMiddleware, payment);
router.get("/verify-session", authMiddleware, verifyPaymentSession);
router.post("/premium-access", authMiddleware, premiumAccess);

export default router;
