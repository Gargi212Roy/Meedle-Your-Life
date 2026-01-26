import { useEffect, useState } from "react";
import "../../stylesheets/landingPage.scss";
import Navbar from "../commons/Navbar";
import AuthCard from "../auth/AuthCard";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegistrationForm";

interface LandingPageProps {
	mode?: "login" | "register";
}

const LandingPage: React.FC<LandingPageProps> = ({ mode }) => {
	const [currentMode, setCurrentMode] = useState<"login" | "register">(
		mode ?? "login",
	);

	useEffect(() => {
		if (mode) {
			setCurrentMode(mode);
		}
	}, [mode]);

	return (
		<div className="landing-page-container">
			<Navbar />

			<section className="hero-section">
				<h1 className="hero-title">Connect. Express. Meedle.</h1>
				<p className="hero-subtitle">
					A calm place to share thoughts, not noise.
				</p>

				<div className="auth-placeholder">
					<AuthCard
						title={
							currentMode === "login"
								? "Welcome back"
								: "Join Meedle"
						}
						subtitle={
							currentMode === "login"
								? "Log in to continue"
								: "Create your account"
						}
					>
						<div
							className={`auth-form-wrapper ${
								currentMode === "login" ? "login" : "register"
							}`}
						>
							{currentMode === "login" ? (
								<LoginForm />
							) : (
								<RegisterForm />
							)}
						</div>

						<div className="auth-switch">
							{currentMode === "login" ? (
								<span>
									Don’t have an account?{" "}
									<a href="/register">Register</a>
								</span>
							) : (
								<span>
									Already have an account?{" "}
									<a href="/login">Login</a>
								</span>
							)}
						</div>
					</AuthCard>
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
