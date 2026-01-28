import api from "../utils/axios";
import { Notification } from "../types/notification";

export const fetchNotifications = async (): Promise<Notification[]> => {
	try {
		const res = await api.get("/notifications");
		return res.data.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const fetchUnreadCount = async (): Promise<number> => {
	try {
		const res = await api.get("/notifications/unread-count");
		return res.data?.data?.count || 0;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const markAllAsRead = async (): Promise<void> => {
	try {
		await api.patch("/notifications/mark-as-read");
	} catch (error) {
		console.log(error);
		throw error;
	}
};
