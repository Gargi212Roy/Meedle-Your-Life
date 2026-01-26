import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { HTTP_STATUS } from "../constants/httpCodes";
import { IJwtPayload } from "../interfaces/common";

const { UNAUTHORIZED, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

export const protect = (
	req: Request,
	res: Response,
	next: NextFunction,
): Response | void => {
	let token: string | undefined;

	if (req.cookies?.token) {
		token = req.cookies.token;
	}

	if (
		!token &&
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return res.status(UNAUTHORIZED).json({
			success: false,
			message: ERROR_MESSAGES.UNAUTHORIZED,
		});
	}

	try {
		if (!process.env.JWT_SECRET) {
			return res.status(INTERNAL_SERVER_ERROR).json({
				success: false,
				message: ERROR_MESSAGES.SERVER_ERROR,
			});
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET,
		) as IJwtPayload;

		req.user = {
			id: decoded.id as any,
			username: decoded.username as any,
		};

		next();
	} catch {
		return res.status(UNAUTHORIZED).json({
			success: false,
			message: ERROR_MESSAGES.TOKEN_FAILED,
		});
	}
};
