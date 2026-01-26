import { Types } from "mongoose";

export interface IUser {
	username: string;
	email: string;
	password: string;
	bio?: string;
	followers: Types.ObjectId[];
	following: Types.ObjectId[];
	createdAt?: Date;
	updatedAt?: Date;
}
