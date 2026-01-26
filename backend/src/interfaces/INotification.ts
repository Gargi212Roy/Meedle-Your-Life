import mongoose from "mongoose";

export interface INotification {
	user: mongoose.Types.ObjectId; // recipient
	type: "like" | "reply" | "follow";
	actor: mongoose.Types.ObjectId; // who did it
	meedle?: mongoose.Types.ObjectId;
	read: boolean;
	createdAt?: Date;
}
