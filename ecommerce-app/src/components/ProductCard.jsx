import { Link } from "react-router-dom";
import { useWishlist } from "../context/AppContext";
import { formatPrice } from "../utils/format";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

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
        onClick={() => toggleWishlist(product.id)}
      >
        {wishlisted ? "♥" : "♡"}
      </button>

      <div className="product-card__body tag-perforation">
        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>
        <div className="product-card__meta">
          <span className="eyebrow">★ {product.rating.toFixed(1)}</span>
          <span className="eyebrow">({product.reviewCount})</span>
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
