import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth, useWishlist } from "../context/AppContext";
import { formatPrice } from "../utils/format";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const wishlisted = isWishlisted(product.id);

  async function handleToggleWishlist() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    setBusy(true);
    try {
      await toggleWishlist(product.id);
    } catch {
      // Non-fatal — the button just stays in its current state.
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="product-card tag-card">
      <Link to={`/product/${product.id}`} className="product-card__media-link">
        <div className="product-card__media">
          <img src={product.images[0]} alt={product.name} loading="lazy" />
          {product.tag && <span className="product-card__tag">{product.tag}</span>}
        </div>
      </Link>

      <button
        type="button"
        className={`product-card__fav ${wishlisted ? "is-active" : ""}`}
        aria-pressed={wishlisted}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleToggleWishlist}
        disabled={busy}
      >
        {wishlisted ? "♥" : "♡"}
      </button>

      <div className="product-card__body tag-perforation">
        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>
        <div className="product-card__meta">
          <span className="eyebrow">★ {Number(product.rating ?? 0).toFixed(1)}</span>
          <span className="eyebrow">({product.reviewCount ?? 0})</span>
        </div>
        <div className="product-card__price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="price-strike">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
