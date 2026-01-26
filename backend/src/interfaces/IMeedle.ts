import { Types } from "mongoose";

export interface IReply {
	text: string;
	author: Types.ObjectId;
	createdAt?: Date;
}

export interface IMeedle {
	text: string;
	author: Types.ObjectId;
	likes: Types.ObjectId[];
	replies: IReply[];
	createdAt?: Date;
	updatedAt?: Date;
}
