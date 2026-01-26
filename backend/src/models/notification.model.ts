import mongoose, { Schema, Model } from "mongoose";
import { INotification } from "../interfaces/INotification";

const NotificationSchema = new Schema<INotification>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		type: { type: String, required: true },
		actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
		meedle: { type: Schema.Types.ObjectId, ref: "Meedle" },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

const Notification: Model<INotification> = mongoose.model(
	"Notification",
	NotificationSchema,
);

export default Notification;
