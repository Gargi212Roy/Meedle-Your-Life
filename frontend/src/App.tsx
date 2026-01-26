import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/landingPage/LandingPage";
import FeedPage from "./components/feed/FeedPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import "./stylesheets/app.scss";
import ProfilePage from "./components/profile/ProfilePage";
import SearchPage from "./components/search/SearchPage";
import NotificationsPage from "./components/notifications/NotificationsPage";
import { useEffect, useState } from "react";
import socket from "./utils/socket";

export default function App(): JSX.Element {
	const [toast, setToast] = useState<string | null>(null);

	useEffect(() => {
		socket.on("notification", () => {
			setToast("New notification");
		});

		return () => {
			socket.off("notification");
		};
	}, []);

	return (
		<BrowserRouter>
			<div className="app-shell">
				<Routes>
					<Route
						path="/"
						element={<Navigate to="/login" replace />}
					/>

					<Route
						path="/login"
						element={
							<PublicRoute>
								<LandingPage mode="login" />
							</PublicRoute>
						}
					/>

					<Route
						path="/register"
						element={
							<PublicRoute>
								<LandingPage mode="register" />
							</PublicRoute>
						}
					/>
					<Route
						path="/profile/:username"
						element={
							<ProtectedRoute>
								<ProfilePage />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/search"
						element={
							<ProtectedRoute>
								<SearchPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/notifications"
						element={
							<ProtectedRoute>
								<NotificationsPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/feed"
						element={
							<ProtectedRoute>
								<FeedPage />
							</ProtectedRoute>
						}
					/>
				</Routes>
				{toast && <div className="toast">{toast}</div>}
			</div>
		</BrowserRouter>
	);
}
