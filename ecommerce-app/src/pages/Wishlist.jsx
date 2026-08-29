import { useWishlist, useCart } from "../context/AppContext";
import { getProductById } from "../data/products";
import { formatPrice } from "../utils/format";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const items = wishlist.map((id) => getProductById(id)).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="container page-section">
        <EmptyState
          icon="♡"
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here for later."
          actionTo="/"
          actionLabel="Discover products"
        />
      </div>
    );
  }

  return (
    <div className="container page-section">
      <h1>Your wishlist</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        {items.length} {items.length === 1 ? "item" : "items"} saved
      </p>

      <ul className="wishlist-list">
        {items.map((product) => (
          <li className="wishlist-line tag-card" key={product.id}>
            <Link to={`/product/${product.id}`} className="cart-line__image">
              <img src={product.images[0]} alt={product.name} />
            </Link>
            <div className="cart-line__info">
              <Link to={`/product/${product.id}`} className="cart-line__name">
                {product.name}
              </Link>
              <p className="price cart-line__unit-price">{formatPrice(product.price)}</p>
            </div>
            <div className="wishlist-line__actions">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => addToCart(product.id, 1)}>
                Add to cart
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => removeFromWishlist(product.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
