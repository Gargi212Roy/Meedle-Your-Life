import mongoose from "mongoose";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const connectDB = async (): Promise<void> => {
	try {
		const mongoUri = process.env.MONGO_URI;

		if (!mongoUri) {
			throw new Error("MONGO_URI not defined in environment variables");
		}

		await mongoose.connect(mongoUri);

		console.log("✅ MongoDB connected");
	} catch (error) {
		console.error("❌ MongoDB connection failed");

		// Optional: log actual error in dev
		if (error instanceof Error) {
			console.error(error.message);
		}

		process.exit(1);
	}
};

export default connectDB;
