import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { IJwtPayload } from "../interfaces/common";

let io: Server;

export const initSocket = (httpServer: any) => {
	io = new Server(httpServer, {
		cors: {
			origin: process.env.CLIENT_URL,
			credentials: true,
		},
	});

	io.use((socket, next) => {
		try {
			const rawCookie = socket.handshake.headers.cookie;

			if (!rawCookie) {
				return next(new Error("No cookies sent"));
			}

			const cookies = cookie.parse(rawCookie);
			const token = cookies.token;

			if (!token || !process.env.JWT_SECRET) {
				return next(new Error("Unauthorized"));
			}

			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET,
			) as IJwtPayload;

			socket.data.userId = decoded.id;
			next();
		} catch (error) {
			next(
				error instanceof Error
					? error
					: new Error("Socket auth failed"),
			);
		}
	});

	io.on("connection", (socket) => {
		const userId = socket.data.userId;
		socket.join(`user:${userId}`);
	});
};

export const getIO = () => io;
