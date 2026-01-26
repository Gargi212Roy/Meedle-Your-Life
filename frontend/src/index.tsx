import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<AuthProvider>
			<SocketProvider>
				<App />
			</SocketProvider>
		</AuthProvider>
	</React.StrictMode>,
);
