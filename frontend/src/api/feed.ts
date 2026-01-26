import api from "../utils/axios";
import {
	CreateMeedlePayload,
	FeedResponse,
	Meedle,
	ToggleLikeResponse,
} from "../types/feed";
import { ApiResponse } from "../types/common";

export const fetchFeed = async (
	page: number,
	limit = 10,
): Promise<FeedResponse> => {
	const res = await api.get<ApiResponse<FeedResponse>>(
		`/feed?page=${page}&limit=${limit}`,
	);
	return res.data.data;
};

export const createMeedle = async (
	payload: CreateMeedlePayload,
): Promise<Meedle> => {
	const res = await api.post<ApiResponse<Meedle>>("/meedles", payload);
	return res.data.data;
};

export const toggleLikeMeedle = async (
	id: string,
): Promise<ToggleLikeResponse> => {
	const res = await api.post<ApiResponse<ToggleLikeResponse>>(
		`/meedles/${id}/like`,
	);
	return res.data.data;
};
