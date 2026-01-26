import { Reply } from "./reply";

export interface FeedAuthor {
	username: string;
}

export interface Meedle {
	_id: string;
	text: string;
	author: {
		_id: string;
		username: string;
	};
	createdAt: string;
	replies?: Reply[];
	likesCount: number;
	likedByMe: boolean;
}

export interface FeedResponse {
	count: number;
	page: number;
	limit: number;
	meedles: Meedle[];
}

export interface CreateMeedlePayload {
	text: string;
}

export interface MeedleComposerProps {
	onCreated: () => void;
}

export interface FeedItemProps {
	meedle: Meedle;
}

export interface ToggleLikeResponse {
	likesCount: number;
	likedByMe: boolean;
}
