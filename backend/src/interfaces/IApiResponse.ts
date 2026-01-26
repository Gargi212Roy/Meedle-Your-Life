export interface IApiResponse<T = undefined> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}
