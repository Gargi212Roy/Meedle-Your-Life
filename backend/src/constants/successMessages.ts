export const SUCCESS_MESSAGES = {
	NO_QUERY: "No query provided, returning empty results",
	USER_REGISTERED: "User registered successfully",
	LOGIN_SUCCESS: "Login successful",
	LOGOUT_SUCCESS: "Logout successful",
	// user specific
	USERS_FETCHED: "Users fetched successfully",
	USER_FETCHED: "User profile fetched successfully",
	USER_UPDATED: "User profile updated successfully",
	// follow specific
	FOLLOW_SUCCESS: "User followed successfully",
	UNFOLLOW_SUCCESS: "User unfollowed successfully",
	// meedle specific
	MEEDLE_CREATED: "Meedle created successfully",
	MEEDLE_DELETED: "Meedle deleted successfully",
	MEEDLE_LIKED: "Meedle liked successfully",
	MEEDLE_UNLIKED: "Meedle unliked successfully",
	REPLY_ADDED: "Reply added successfully",
	MEEDLES_FETCHED: "Meedles fetched successfully",
	REPLIES_FETCHED: "Replies fetched successfully",
	// feed specific
	FEED_FETCHED: "Feed fetched successfully",
	// notification specific
	NOTIFICATIONS_FETCHED: "All Notifications fetched successfully",
	UNREAD_COUNT_FETCHED: "Unread notification count fetched successfully",
	NOTIFICATIONS_MARKED_AS_READ: "Notifications marked as read successfully",
} as const;
