import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
	children: JSX.Element;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
	const { isAuthenticated, loading } = useAuth();

	if (loading) return null;

	if (isAuthenticated) {
		return <Navigate to="/feed" replace />;
	}

	return children;
};

export default PublicRoute;
