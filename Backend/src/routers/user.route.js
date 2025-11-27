import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { UserData, UserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/data", authMiddleware, UserData);
router.put("/upload-profile", authMiddleware, UserProfile);

export default router;