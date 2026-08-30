import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="container page-section">
        <div className="skeleton" style={{ height: 96 }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
