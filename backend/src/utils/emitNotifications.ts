import { getIO } from "../socket";

export const emitNotification = (userId: string, payload: any) => {
	const io = getIO();
	io.to(`user:${userId}`).emit("notification", payload);
};
