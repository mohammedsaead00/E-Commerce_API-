import { Link } from "react-router-dom";
import "./EmptyState.css";

export default function EmptyState({ icon = "🗂", title, message, actionTo, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionTo && actionLabel && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
