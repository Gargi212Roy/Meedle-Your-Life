import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
	getNotifications,
	getUnreadCount,
	markNotificationsAsRead,
} from "../controllers/notification.controller";

const router = Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.patch("/mark-as-read", protect, markNotificationsAsRead);

export default router;
