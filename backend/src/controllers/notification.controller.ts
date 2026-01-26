import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/apiResponse";
import Notification from "../models/notification.model";
import { HTTP_STATUS } from "../constants/httpCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { SUCCESS_MESSAGES } from "../constants/successMessages";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND, CREATED, OK } =
	HTTP_STATUS;

export const getNotifications = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user?.id;

		const notifications = await Notification.find({ user: userId })
			.populate("actor", "username")
			.populate("meedle", "text")
			.sort({ createdAt: -1 })
			.limit(20);

		return sendSuccess(
			res,
			SUCCESS_MESSAGES.NOTIFICATIONS_FETCHED,
			notifications,
			HTTP_STATUS.OK,
		);
	} catch (error) {
		console.error("Error fetching notifications:", error);
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};

/**
 * Retrieves the count of unread notifications of the user
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<Response>} - A promise that resolves to a response object
 */
export const getUnreadCount = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user?.id;

		const count = await Notification.countDocuments({
			user: userId,
			read: false,
		});

		return sendSuccess(
			res,
			SUCCESS_MESSAGES.UNREAD_COUNT_FETCHED,
			{
				count,
			},
			HTTP_STATUS.OK,
		);
	} catch (error) {
		console.error("Error fetching unread notification count:", error);
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};

export const markNotificationsAsRead = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	try {
		const userId = req.user?.id;

		await Notification.updateMany(
			{ user: userId, read: false },
			{ $set: { read: true } },
		);

		return sendSuccess(
			res,
			SUCCESS_MESSAGES.NOTIFICATIONS_MARKED_AS_READ,
			null,
			HTTP_STATUS.OK,
		);
	} catch (error) {
		console.error("Error marking notifications as read:", error);
		return sendError(
			res,
			ERROR_MESSAGES.SERVER_ERROR,
			INTERNAL_SERVER_ERROR,
		);
	}
};
