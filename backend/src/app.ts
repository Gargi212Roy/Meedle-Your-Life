import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

import testRoutes from "./routes/test.route";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import followRoutes from "./routes/follow.route";
import meedleRoutes from "./routes/meedle.route";
import feedRoutes from "./routes/feed.route";
import notificationRoutes from "./routes/notification.route";

import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

/* -------------------- routes -------------------- */
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", followRoutes);
app.use("/api/meedles", meedleRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
