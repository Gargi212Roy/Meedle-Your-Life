import api from "../utils/axios";
import { SearchUser } from "../types/search";

export const searchUsers = async (query: string): Promise<SearchUser[]> => {
	try {
		const res = await api.get(`/users/search?q=${query}`);
		return res.data.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
