import { Request, Response } from "express";
import User from "../models/user.model";
import Meedle from "../models/meedle.model";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = HTTP_STATUS;

/**
 * Retrieves the feed of the user, containing the meedles of the users the user is following.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found, or if the meedles cannot be fetched
 */
export const getFeed = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user?.id;

		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const user = await User.findById(userId).select("following");
		if (!user) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, NOT_FOUND);
		}

		const authorIds = [userId, ...user.following];

		const totalCount = await Meedle.countDocuments({
			author: { $in: authorIds },
		});

		const meedles = await Meedle.find({
			author: { $in: authorIds },
		})
			.populate("author", "username")
			.populate("replies.author", "username")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();

		const enrichedMeedles = meedles.map((m) => ({
			...m,
			likesCount: m.likes.length,
			likedByMe: m.likes.some((id: any) => id.toString() === userId),
		}));

		return sendSuccess(res, SUCCESS_MESSAGES.FEED_FETCHED, {
			page,
			limit,
			count: totalCount,
			meedles: enrichedMeedles,
		});
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};
