import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import Notification from "../models/notification.model";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { HTTP_STATUS } from "../constants/httpCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";
import { emitNotification } from "../utils/emitNotifications";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND, OK } = HTTP_STATUS;

/**
 * Follows a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found, if the user is already following the target user, or if the user tries to follow themselves
 */
export const followUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const currentUserId = req.user?.id;
		const targetUserId = Array.isArray(req.params.id)
			? req.params.id[0]
			: req.params.id;

		if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, NOT_FOUND);
		}

		if (currentUserId?.toString() === targetUserId) {
			return sendError(
				res,
				ERROR_MESSAGES.CANNOT_FOLLOW_SELF,
				BAD_REQUEST,
			);
		}

		const targetUser = await User.findById(targetUserId);
		const currentUser = await User.findById(currentUserId);

		if (!targetUser || !currentUser) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, NOT_FOUND);
		}

		if (currentUser.following.includes(targetUser._id)) {
			return sendError(
				res,
				ERROR_MESSAGES.ALREADY_FOLLOWING,
				BAD_REQUEST,
			);
		}

		currentUser.following.push(targetUser._id);
		targetUser.followers.push(currentUser._id);

		await currentUser.save();
		await targetUser.save();

		// Create a follow notification
		if (!targetUser.followers.includes(currentUser._id)) {
			targetUser.followers.push(currentUser._id);
			currentUser.following.push(targetUser._id);

			await Notification.create({
				user: targetUser._id,
				type: "follow",
				actor: currentUser._id,
			});

			emitNotification(targetUser._id.toString(), {
				type: "follow",
			});
		}

		return sendSuccess(
			res,
			SUCCESS_MESSAGES.FOLLOW_SUCCESS,
			{
				followingCount: currentUser.following.length,
			},
			OK,
		);
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Unfollows a user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 * @throws {HttpException} - If the user is not found, if the user is not following the target user, or if the user tries to unfollow themselves
 */
export const unfollowUser = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const currentUserId = req.user?.id;
		const targetUserId = Array.isArray(req.params.id)
			? req.params.id[0]
			: req.params.id;

		if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, NOT_FOUND);
		}

		const targetUser = await User.findById(targetUserId);
		const currentUser = await User.findById(currentUserId);

		if (!targetUser || !currentUser) {
			return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, NOT_FOUND);
		}

		if (!currentUser.following.includes(targetUser._id)) {
			return sendError(res, ERROR_MESSAGES.NOT_FOLLOWING, BAD_REQUEST);
		}

		currentUser.following = currentUser.following.filter(
			(id) => id.toString() !== targetUserId,
		);

		targetUser.followers = targetUser.followers.filter(
			(id) => id.toString() !== currentUserId?.toString(),
		);

		await currentUser.save();
		await targetUser.save();

		return sendSuccess(
			res,
			SUCCESS_MESSAGES.UNFOLLOW_SUCCESS,
			{
				followingCount: currentUser.following.length,
			},
			OK,
		);
	} catch {
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};
