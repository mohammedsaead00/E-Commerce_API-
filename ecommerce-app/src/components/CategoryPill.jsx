import { Link } from "react-router-dom";
import "./CategoryPill.css";

export default function CategoryPill({ category, active = false }) {
  return (
    <Link
      to={`/category/${category.id}`}
      className={`category-pill ${active ? "is-active" : ""}`}
    >
      <span className="category-pill__icon" aria-hidden="true">
        {category.icon}
      </span>
      <span>{category.label}</span>
    </Link>
  );
}
