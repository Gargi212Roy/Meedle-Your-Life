import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../stylesheets/navbar.scss";
import { useEffect, useState } from "react";
import { fetchUnreadCount } from "../../api/notifications";
import socket from "../../utils/socket";

const Navbar: React.FC = () => {
	const { isAuthenticated, logout, user } = useAuth();
	const [unreadCount, setUnreadCount] = useState(0);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		socket.on("notification", () => {
			setUnreadCount((c) => c + 1);
		});

		return () => {
			socket.off("notification");
		};
	}, []);

	useEffect(() => {
		fetchUnreadCount()
			.then(setUnreadCount)
			.catch(() => {
				setUnreadCount(0);
			});
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			setMenuOpen(false);
		} catch (e) {
			console.error("Logout failed", e);
		}
	};

	const closeMenu = () => setMenuOpen(false);

	return (
		<nav className="navbar-container">
			<div className="name">Meedle</div>

			<div className="navbar-actions desktop-only">
				{isAuthenticated ? (
					<>
						<NavLink to="/search" className="nav-link">
							Search
						</NavLink>

						<NavLink to="/feed" className="nav-link">
							Feed
						</NavLink>

						<NavLink
							to={`/profile/${user?.username}`}
							className="nav-link"
						>
							My Profile
						</NavLink>

						<NavLink to="/notifications" className="nav-link">
							Notifications
							{unreadCount > 0 && (
								<span className="notif-badge">
									{unreadCount}
								</span>
							)}
						</NavLink>

						<button onClick={handleLogout} className="auth-link">
							Logout
						</button>
					</>
				) : (
					<>
						<NavLink to="/login" className="nav-link">
							Login
						</NavLink>
						<NavLink to="/register" className="nav-link">
							Register
						</NavLink>
					</>
				)}
			</div>

			<button
				className="hamburger"
				onClick={() => setMenuOpen((o) => !o)}
				aria-label="Toggle menu"
			>
				<span />
				<span />
				<span />
			</button>

			{menuOpen && (
				<div className="mobile-menu">
					{isAuthenticated ? (
						<>
							<NavLink to="/search" onClick={closeMenu}>
								Search
							</NavLink>

							<NavLink to="/feed" onClick={closeMenu}>
								Feed
							</NavLink>

							<NavLink
								to={`/profile/${user?.username}`}
								onClick={closeMenu}
							>
								My Profile
							</NavLink>

							<NavLink to="/notifications" onClick={closeMenu}>
								Notifications
								{unreadCount > 0 && (
									<span className="notif-badge">
										{unreadCount}
									</span>
								)}
							</NavLink>

							<button onClick={handleLogout}>Logout</button>
						</>
					) : (
						<>
							<NavLink to="/login" onClick={closeMenu}>
								Login
							</NavLink>
							<NavLink to="/register" onClick={closeMenu}>
								Register
							</NavLink>
						</>
					)}
				</div>
			)}
		</nav>
	);
};

export default Navbar;
