import { ReactNode } from "react";
import { Meedle } from "./feed";

export interface UserProfile {
	_id: string;
	username: string;
	followersCount: number;
	followingCount: number;
	isFollowing: boolean;
	bio?: string;
	email?: string;
}

export interface UserMeedlesResponse {
	page: number;
	limit: number;
	count: number;
	meedles: Meedle[];
}

export type ProfileTab = "meedles" | "replies" | "likes";

export interface AuthCardProps {
	title: string;
	subtitle: string;
	children: ReactNode;
}
