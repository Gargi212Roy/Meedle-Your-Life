export const ERROR_MESSAGES = {
	INVALID_INPUT: "Invalid input",
	REQUIRED_FIELDS: "All fields are required",
	USER_EXISTS: "User with this email or username already exists",
	INVALID_CREDENTIALS: "Invalid credentials",
	USER_NOT_FOUND: "User not found",
	UNAUTHORIZED: "Not authorized",
	TOKEN_FAILED: "Token verification failed",
	SERVER_ERROR: "Internal server error",
	// user specific
	BIO_TOO_LONG: "Bio must be 160 characters or less",
	// follow specific
	CANNOT_FOLLOW_SELF: "You cannot follow yourself",
	ALREADY_FOLLOWING: "You are already following this user",
	NOT_FOLLOWING: "You are not following this user",
	// meedle specific
	MEEDLE_TEXT_REQUIRED: "Meedle text is required",
	MEEDLE_TOO_LONG: "Meedle must be 280 characters or less",
	MEEDLE_NOT_FOUND: "Meedle not found",
	NOT_MEEDLE_OWNER: "You are not allowed to perform this action",
} as const;
