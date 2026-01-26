import { Response } from "express";
import { HTTP_STATUS } from "../constants/httpCodes";
import { IApiResponse } from "../interfaces/IApiResponse";

export const sendSuccess = <T>(
	res: Response,
	message: string,
	data?: T,
	statusCode: number = HTTP_STATUS.OK,
): Response => {
	const response: IApiResponse<T> = {
		success: true,
		message,
		data,
	};

	return res.status(statusCode).json(response);
};

export const sendError = (
	res: Response,
	message: string,
	statusCode: number,
	error?: Error,
): Response => {
	const response: IApiResponse = {
		success: false,
		message,
		error: error?.message,
	};

	return res.status(statusCode).json(response);
};
