import api from "../utils/axios";
import { Reply } from "../types/reply";

export const addReply = async (
	meedleId: string,
	text: string,
): Promise<Reply> => {
	const res = await api.post(`/meedles/${meedleId}/replies`, {
		text,
	});
	return res.data.data.reply;
};
