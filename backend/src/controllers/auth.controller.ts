import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
import { HTTP_STATUS } from "../constants/httpCodes";
import { sendSuccess, sendError } from "../utils/apiResponse";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, CREATED, OK } = HTTP_STATUS;

/**
 * Registers a new user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 */
export const registerUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { username, email, password } = req.body as {
			username: string;
			email: string;
			password: string;
		};

		if (!username || !email || !password) {
			return sendError(
				res,
				ERROR_MESSAGES.REQUIRED_FIELDS,
				BAD_REQUEST,
				new Error(ERROR_MESSAGES.REQUIRED_FIELDS),
			);
		}

		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			return sendError(
				res,
				ERROR_MESSAGES.USER_EXISTS,
				BAD_REQUEST,
				new Error(ERROR_MESSAGES.USER_EXISTS),
			);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
			followers: [],
			following: [],
		});

		const responseData = {
			_id: user._id,
			username: user.username,
			token: generateToken(user._id.toString(), username),
		};

		return res
			.cookie("token", generateToken(user._id.toString(), username), {
				httpOnly: true,
				sameSite:
					process.env.NODE_ENV === "production" ? "none" : "lax",
				secure: process.env.NODE_ENV === "production",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			})
			.status(CREATED)
			.json({
				success: true,
				message: SUCCESS_MESSAGES.USER_REGISTERED,
				data: {
					_id: user._id,
					username: user.username,
				},
			});
	} catch (error) {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
			error as Error,
		);
	}
};

/**
 * Logs in a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user email or password are invalid
 */
export const loginUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { email, password } = req.body as {
			email: string;
			password: string;
		};

		if (!email || !password) {
			return sendError(
				res,
				ERROR_MESSAGES.REQUIRED_FIELDS,
				BAD_REQUEST,
				new Error(ERROR_MESSAGES.REQUIRED_FIELDS),
			);
		}

		const user = await User.findOne({ email });
		if (!user) {
			return sendError(
				res,
				ERROR_MESSAGES.INVALID_CREDENTIALS,
				BAD_REQUEST,
				new Error(ERROR_MESSAGES.INVALID_CREDENTIALS),
			);
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return sendError(
				res,
				ERROR_MESSAGES.INVALID_CREDENTIALS,
				BAD_REQUEST,
				new Error(ERROR_MESSAGES.INVALID_CREDENTIALS),
			);
		}

		const responseData = {
			_id: user._id,
			username: user.username,
			token: generateToken(user._id.toString(), user.username),
		};

		return res
			.cookie(
				"token",
				generateToken(user._id.toString(), user.username),
				{
					httpOnly: true,
					sameSite:
						process.env.NODE_ENV === "production" ? "none" : "lax",
					secure: process.env.NODE_ENV === "production",
					maxAge: 7 * 24 * 60 * 60 * 1000,
				},
			)
			.status(OK)
			.json({
				success: true,
				message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
				data: {
					_id: user._id,
					username: user.username,
				},
			});
	} catch (error) {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
			error as Error,
		);
	}
};
