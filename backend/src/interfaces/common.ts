import { Types } from "mongoose";

export interface IAuthUser {
	id: Types.ObjectId;
	username: string;
}

export interface IJwtPayload {
	id: string;
	username: string;
}
