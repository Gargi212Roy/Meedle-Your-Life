import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
			maxlength: 160,
			default: "",
		},
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true },
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
