import { Request, Response } from "express";
import User from "../models/user.model";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
import Meedle from "../models/meedle.model";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } =
	HTTP_STATUS;

/**
 * Retrieves the currently logged in user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found
 */
export const getCurrentUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user?.id;

		if (!userId) {
			return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, UNAUTHORIZED);
		}

		const user = await User.findById(userId).select("username email bio");

		if (!user) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, NOT_FOUND);
		}

		return sendSuccess(res, SUCCESS_MESSAGES.USER_FETCHED, {
			_id: user._id,
			username: user.username,
			email: user.email,
			bio: user.bio,
			followersCount: user.followers.length,
			followingCount: user.following.length,
		});
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Retrieves a user by their username
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found
 */
export const getUserByUsername = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { username } = req.params;
		const viewerId = req.user?.id;

		const user = await User.findOne({ username }).select(
			"username bio email followers following",
		);

		if (!user) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, NOT_FOUND);
		}

		let isFollowing = false;

		if (viewerId) {
			const viewer = await User.findById(viewerId).select("following");

			isFollowing =
				viewer?.following.some(
					(fid) => fid.toString() === user._id.toString(),
				) ?? false;
		}

		const isOwnProfile = viewerId?.toString() === user._id.toString();

		return sendSuccess(res, SUCCESS_MESSAGES.USER_FETCHED, {
			_id: user._id,
			username: user.username,
			bio: user.bio,
			followersCount: user.followers.length,
			followingCount: user.following.length,
			isFollowing,
			email: isOwnProfile ? user.email : undefined,
		});
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Updates a user's bio
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found, or if the bio is too long
 */
export const updateBio = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user?.id;
		const { bio } = req.body as { bio: string };

		if (bio && bio.length > 160) {
			return sendError(res, ERROR_MESSAGES.BIO_TOO_LONG, BAD_REQUEST);
		}

		const user = await User.findByIdAndUpdate(
			userId,
			{ bio },
			{ new: true },
		).select("-password");

		if (!user) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, NOT_FOUND);
		}

		return sendSuccess(res, SUCCESS_MESSAGES.USER_UPDATED, user);
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Retrieves the replies of a user with the given username
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found
 */

export const getUserReplies = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, 404);
		}

		const meedles = await Meedle.find({
			"replies.author": user._id,
		})
			.populate("author", "username")
			.sort({ createdAt: -1 })
			.lean();

		const replies = meedles.flatMap((m) =>
			m.replies
				.filter((r) => r.author.toString() === user._id.toString())
				.map((r) => ({
					...r,
					meedleId: m._id,
					meedleText: m.text,
				})),
		);

		return sendSuccess(res, SUCCESS_MESSAGES.REPLIES_FETCHED, replies);
	} catch (error) {
		console.error(error);
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Retrieves the meedles that the user with the given username has liked
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found
 */
export const getUserLikedMeedles = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	const { username } = req.params;
	const viewerId = req.user?.id;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, 404);
		}

		const meedles = await Meedle.find({
			likes: user._id,
		})
			.populate("author", "username")
			.sort({ createdAt: -1 })
			.lean();

		const enriched = meedles.map((m) => ({
			...m,
			likesCount: m.likes.length,
			likedByMe: m.likes.some((id: any) => id.toString() === viewerId),
		}));

		return sendSuccess(res, SUCCESS_MESSAGES.MEEDLES_FETCHED, enriched);
	} catch (error) {
		console.error(error);
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Searches for users with the given query
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the server encounters an error
 */
export const searchUsers = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const query = req.query.q as string;

		if (!query || query.trim().length < 2) {
			return sendSuccess(res, SUCCESS_MESSAGES.NO_QUERY, []);
		}

		const users = await User.find({
			username: { $regex: query, $options: "i" },
		})
			.select("username bio")
			.limit(10);

		return sendSuccess(res, SUCCESS_MESSAGES.USERS_FETCHED, users);
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
		);
	}
};
