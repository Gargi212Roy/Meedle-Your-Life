import { useEffect, useState } from "react";
import Navbar from "../commons/Navbar";
import { fetchNotifications, markAllAsRead } from "../../api/notifications";
import { Notification } from "../../types/notification";
import { getRelativeTime } from "../../utils/time";
import "../../stylesheets/notifications.scss";

const NotificationsPage: React.FC = () => {
	const [items, setItems] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			const data = await fetchNotifications();
			setItems(data);
			await markAllAsRead();
		};

		load();
	}, []);

	useEffect(() => {
		fetchNotifications().then((data) => {
			setItems(data);
			setLoading(false);
		});
	}, []);

	if (loading) return null;

	const getNotificationText = (n: Notification) => {
		switch (n.type) {
			case "like":
				return "liked your meedle";
			case "reply":
				return "replied to your meedle";
			case "follow":
				return "started following you";
			default:
				return "";
		}
	};

	return (
		<>
			<Navbar />

			<main className="feed-container">
				<h2 className="notifications-title">Notifications</h2>

				{items.length === 0 && (
					<p className="feed-empty">No notifications yet</p>
				)}

				{items.map((n) => (
					<div key={n._id} className="notification-item">
						<span className="notification-text">
							<strong>@{n.actor.username}</strong>{" "}
							{getNotificationText(n)}
						</span>

						<span className="notification-time">
							{getRelativeTime(n.createdAt)}
						</span>
					</div>
				))}
			</main>
		</>
	);
};

export default NotificationsPage;
