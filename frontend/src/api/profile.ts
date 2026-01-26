import api from "../utils/axios";
import { ApiResponse } from "../types/common";
import { UserProfile, UserMeedlesResponse } from "../types/profile";
import { Meedle } from "../types/feed";

export const fetchUserProfile = async (
	username: string,
): Promise<UserProfile> => {
	const res = await api.get<ApiResponse<UserProfile>>(`/users/${username}`);
	return res.data.data;
};

export const followUser = async (userId: string): Promise<void> => {
	await api.post(`/users/${userId}/follow`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
	await api.post(`/users/${userId}/unfollow`);
};

export const fetchUserMeedles = async (
	username: string,
	page: number,
	limit = 10,
): Promise<UserMeedlesResponse> => {
	const res = await api.get<ApiResponse<UserMeedlesResponse>>(
		`/meedles/${username}/meedles?page=${page}&limit=${limit}`,
	);
	return res.data.data;
};

export const fetchUserReplies = async (username: string) => {
	const res = await api.get(`/users/${username}/replies`);
	return res.data.data;
};

export const fetchUserLikes = async (username: string): Promise<Meedle[]> => {
	const res = await api.get(`/users/${username}/likes`);
	return res.data.data;
};
