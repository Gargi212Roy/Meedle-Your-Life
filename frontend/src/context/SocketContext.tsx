import { createContext, useContext, useEffect } from "react";
import socket from "../utils/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			socket.connect();
		} else {
			socket.disconnect();
		}

		return () => {
			socket.disconnect();
		};
	}, [isAuthenticated]);

	return (
		<SocketContext.Provider value={null}>{children}</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
