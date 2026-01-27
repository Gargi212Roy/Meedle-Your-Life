import "../../stylesheets/auth.scss";
import { AuthCardProps } from "../../types/profile";

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
	return (
		<div className="auth-card">
			<h2 className="auth-title">{title}</h2>
			<p className="auth-subtitle">{subtitle}</p>

			<div className="auth-content">{children}</div>
		</div>
	);
};

export default AuthCard;
