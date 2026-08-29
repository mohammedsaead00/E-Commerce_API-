import EmptyState from "../components/EmptyState";

export default function NotFound() {
  return (
    <div className="container page-section">
      <EmptyState
        icon="🧭"
        title="Page not found"
        message="The page you're looking for doesn't exist or may have moved."
        actionTo="/"
        actionLabel="Back to home"
      />
    </div>
  );
}
