import { Request, Response } from "express";
import mongoose from "mongoose";
import Meedle from "../models/meedle.model";
import Notification from "../models/notification.model";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
import User from "../models/user.model";
import { emitNotification } from "../utils/emitNotifications";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND, CREATED, OK } =
	HTTP_STATUS;

/**
 * Creates a new meedle
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If meedle text is not provided, or if the meedle text is too long
 */
export const createMeedle = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { text } = req.body as { text: string };

		if (!text) {
			return sendError(
				res,
				ERROR_MESSAGES.MEEDLE_TEXT_REQUIRED,
				HTTP_STATUS.BAD_REQUEST,
			);
		}

		if (text.length > 280) {
			return sendError(
				res,
				ERROR_MESSAGES.MEEDLE_TOO_LONG,
				HTTP_STATUS.BAD_REQUEST,
			);
		}

		const meedle = await Meedle.create({
			text,
			author: req.user?.id,
			likes: [],
			replies: [],
		});

		return sendSuccess(
			res,
			SUCCESS_MESSAGES.MEEDLE_CREATED,
			meedle,
			HTTP_STATUS.CREATED,
		);
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Deletes a meedle by its id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the meedle is not found, or if the meedle author is not the same as the current user
 */
export const deleteMeedle = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { id } = req.params;
		const idString = Array.isArray(id) ? id[0] : id;

		if (!mongoose.Types.ObjectId.isValid(idString)) {
			return sendError(
				res,
				ERROR_MESSAGES.MEEDLE_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND,
			);
		}

		const meedle = await Meedle.findById(idString);
		if (!meedle) {
			return sendError(
				res,
				ERROR_MESSAGES.MEEDLE_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND,
			);
		}

		if (meedle.author.toString() !== req.user?.id.toString()) {
			return sendError(
				res,
				ERROR_MESSAGES.NOT_MEEDLE_OWNER,
				HTTP_STATUS.FORBIDDEN,
			);
		}

		await meedle.deleteOne();

		return sendSuccess(res, SUCCESS_MESSAGES.MEEDLE_DELETED);
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Toggles a like on a meedle by its id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the meedle is not found, or if the meedle author is not the same as the current user
 */
export const toggleLikeMeedle = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		const meedle = await Meedle.findById(id);
		if (!meedle) {
			return sendError(
				res,
				ERROR_MESSAGES.MEEDLE_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND,
			);
		}

		const userIdString = userId?.toString();
		const hasLiked = meedle.likes.some(
			(uid) => uid.toString() === userIdString,
		);

		if (hasLiked) {
			meedle.likes = meedle.likes.filter(
				(uid) => uid.toString() !== userIdString,
			);
		} else {
			meedle.likes.push(userId as any);
		}

		await meedle.save();

		if (!hasLiked) {
			await Notification.create({
				user: meedle.author,
				type: "like",
				actor: userId,
				meedle: meedle._id,
			});

			emitNotification(meedle.author.toString(), {
				type: "like",
			});
		}

		return sendSuccess(
			res,
			hasLiked
				? SUCCESS_MESSAGES.MEEDLE_UNLIKED
				: SUCCESS_MESSAGES.MEEDLE_LIKED,
			{
				likesCount: meedle.likes.length,
				likedByMe: !hasLiked,
			},
		);
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Adds a reply to a meedle by its id
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the meedle is not found, or if the meedle text is not provided or too long
 */
export const addReply = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { id } = req.params;
		const { text } = req.body;
		const userId = req.user?.id;

		if (!text || text.trim().length === 0) {
			return sendError(res, ERROR_MESSAGES.INVALID_INPUT, BAD_REQUEST);
		}

		if (!userId) {
			return sendError(res, ERROR_MESSAGES.INVALID_INPUT, BAD_REQUEST);
		}

		const meedle = await Meedle.findById(id);
		if (!meedle) {
			return sendError(res, ERROR_MESSAGES.MEEDLE_NOT_FOUND, NOT_FOUND);
		}

		const reply = {
			text,
			author: userId,
			createdAt: new Date(),
		};

		meedle.replies.push(reply);
		await meedle.save();

		await meedle.populate("replies.author", "username");

		// only notify if replying to someone else's meedle
		if (meedle.author.toString() !== userId.toString()) {
			await Notification.create({
				user: meedle.author,
				type: "reply",
				actor: userId,
				meedle: meedle._id,
			});

			emitNotification(meedle.author.toString(), {
				type: "reply",
			});
		}

		return sendSuccess(res, SUCCESS_MESSAGES.REPLY_ADDED, {
			reply: meedle.replies.at(-1),
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
 * Retrieves the meedles of the user with the given username
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found, or if the meedles cannot be fetched
 */
export const getUserMeedles = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const { username } = req.params;

		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const user = await User.findOne({ username });
		if (!user) {
			return sendError(
				res,
				ERROR_MESSAGES.USER_NOT_FOUND,
				HTTP_STATUS.NOT_FOUND,
			);
		}

		const totalCount = await Meedle.countDocuments({
			author: user._id,
		});

		const meedles = await Meedle.find({ author: user._id })
			.populate("author", "username")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();

		const enriched = meedles.map((m) => ({
			...m,
			likesCount: m.likes.length,
			likedByMe: m.likes.some(
				(id: any) => id.toString() === req.user?.id,
			),
		}));

		return sendSuccess(res, SUCCESS_MESSAGES.MEEDLES_FETCHED, {
			page,
			limit,
			count: totalCount,
			meedles: enriched,
		});
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			HTTP_STATUS.INTERNAL_SERVER_ERROR,
		);
	}
};
