import api from "../utils/axios";
import { ApiResponse } from "../types/common";
import { UserProfile, UserMeedlesResponse } from "../types/profile";
import { Meedle } from "../types/feed";

export const fetchUserProfile = async (
	username: string,
): Promise<UserProfile> => {
	try {
		const res = await api.get<ApiResponse<UserProfile>>(
			`/users/${username}`,
		);
		return res.data.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const followUser = async (userId: string): Promise<void> => {
	try {
		await api.post(`/users/${userId}/follow`);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const unfollowUser = async (userId: string): Promise<void> => {
	try {
		await api.post(`/users/${userId}/unfollow`);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const fetchUserMeedles = async (
	username: string,
	page: number,
	limit = 10,
): Promise<UserMeedlesResponse> => {
	try {
		const res = await api.get<ApiResponse<UserMeedlesResponse>>(
			`/meedles/${username}/meedles?page=${page}&limit=${limit}`,
		);
		return res.data.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const fetchUserReplies = async (username: string) => {
	try {
		const res = await api.get(`/users/${username}/replies`);
		return res.data.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const fetchUserLikes = async (username: string): Promise<Meedle[]> => {
	try {
		const res = await api.get(`/users/${username}/likes`);
		return res.data.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
