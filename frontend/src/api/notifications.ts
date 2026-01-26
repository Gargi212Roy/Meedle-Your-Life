import api from "../utils/axios";
import { Notification } from "../types/notification";

export const fetchNotifications = async (): Promise<Notification[]> => {
	const res = await api.get("/notifications");
	return res.data.data;
};

export const fetchUnreadCount = async (): Promise<number> => {
	const res = await api.get("/notifications/unread-count");
	return res.data.data.count;
};

export const markAllAsRead = async (): Promise<void> => {
	await api.patch("/notifications/mark-as-read");
};
