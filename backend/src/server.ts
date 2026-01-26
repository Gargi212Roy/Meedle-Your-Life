import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { initSocket } from "./socket";

dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
