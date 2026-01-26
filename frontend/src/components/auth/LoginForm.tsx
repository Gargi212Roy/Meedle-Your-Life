import { useState } from "react";
import api from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";

const LoginForm: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { refreshAuth } = useAuth();

	const showEmailHint = email.length > 0 && !email.includes("@");
	const showPasswordHint = password.length > 0 && password.length < 6;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await api.post("/auth/login", { email, password });
			await refreshAuth();
		} catch (err: any) {
			setError(err.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className="auth-form" onSubmit={handleSubmit}>
			<div className="field">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{showEmailHint && (
					<span className="hint">Enter a valid email</span>
				)}
			</div>

			<div className="field password-field">
				<input
					type={showPassword ? "text" : "password"}
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					type="button"
					className="toggle-password"
					onClick={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? "Hide" : "Show"}
				</button>
			</div>

			{showPasswordHint && (
				<span className="hint">
					Password must be at least 6 characters
				</span>
			)}

			{error && <div className="auth-error">{error}</div>}

			<button type="submit">{loading ? "Logging in..." : "Login"}</button>
		</form>
	);
};

export default LoginForm;
