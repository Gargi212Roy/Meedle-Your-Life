export interface Reply {
	_id: string;
	text: string;
	author: {
		_id: string;
		username: string;
	};
	createdAt: string;
}
