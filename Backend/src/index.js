import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routers/auth.route.js"
import chatbotRoutes from "./routers/chatbot.route.js"
import UserRoutes from "./routers/user.route.js"
import paymentRoutes from "./routers/payment.route.js"
import middlewares from "./middlewares/middlewares.js";

const app = express();
dotenv.config();
app.set("trust proxy", 1);
middlewares(app);
app.use("/api/auth", authRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/chat", chatbotRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running at PORT : ${PORT}`);
})


