export interface ApiResponse<data> {
	success: boolean;
	data: data;
}

export interface AuthUser {
	id: string;
	username: string;
}

export interface AuthContextType {
	isAuthenticated: boolean;
	user: AuthUser | null;
	loading: boolean;
	refreshAuth: () => Promise<void>;
	logout: () => Promise<void>;
}
