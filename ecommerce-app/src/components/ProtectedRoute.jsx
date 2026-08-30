import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AppContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  // While we're verifying a stored token (e.g. right after a page refresh),
  // avoid bouncing the user to /login before we actually know their status.
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
