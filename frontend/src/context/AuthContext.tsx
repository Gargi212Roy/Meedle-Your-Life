import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios";
import { AuthContextType, AuthUser } from "../types/common";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshAuth = async () => {
		try {
			const res = await api.get("/auth/me");

			setUser(res.data.data);
			setIsAuthenticated(true);
		} catch {
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			await api.post("/auth/logout");
		} catch (e) {
			console.error("Logout failed", e);
		} finally {
			setUser(null);
			setIsAuthenticated(false);
		}
	};

	useEffect(() => {
		refreshAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				user,
				loading,
				refreshAuth,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};
