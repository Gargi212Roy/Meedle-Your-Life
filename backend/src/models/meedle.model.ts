import mongoose, { Schema, Model } from "mongoose";
import { IMeedle, IReply } from "../interfaces/IMeedle";

const ReplySchema = new Schema<IReply>({
	text: { type: String, maxlength: 120 },
	author: { type: Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: Date.now },
});

const MeedleSchema = new Schema<IMeedle>(
	{
		text: {
			type: String,
			required: true,
			maxlength: 120,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
		replies: [ReplySchema],
	},
	{ timestamps: true },
);

const Meedle: Model<IMeedle> = mongoose.model<IMeedle>("Meedle", MeedleSchema);

export default Meedle;
