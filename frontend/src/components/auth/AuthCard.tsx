import { ReactNode } from "react";
import "../../stylesheets/auth.scss";

interface AuthCardProps {
	title: string;
	subtitle: string;
	children: ReactNode;
}

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
