import jwt from "jsonwebtoken";

export const generateToken = (userId: string, username: string): string => {
	if (!process.env.JWT_SECRET) {
		throw new Error("JWT_SECRET not defined");
	}

	return jwt.sign({ id: userId, username }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});
};
