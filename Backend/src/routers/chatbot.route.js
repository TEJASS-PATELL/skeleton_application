import express from "express";
const router = express.Router();
import { chatbot } from "../controllers/chatbot.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

router.post("/chatbot", authMiddleware, chatbot);

export default router;