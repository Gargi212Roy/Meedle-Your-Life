export interface Notification {
	_id: string;
	type: "like" | "reply" | "follow";
	actor: {
		username: string;
	};
	meedle?: {
		_id: string;
		text: string;
	};
	read: boolean;
	createdAt: string;
}

export interface UnreadCount {
	count: number;
}
