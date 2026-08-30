import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist, useCart } from "../context/AppContext";
import { formatPrice } from "../utils/format";
import EmptyState from "../components/EmptyState";

export default function Wishlist() {
  const { wishlist, loading, error, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const items = wishlist.filter((item) => item.product);

  async function handleAddToCart(item) {
    setActionError("");
    setBusyId(item.id);
    try {
      await addToCart(item.productId, 1);
    } catch (err) {
      setActionError(err.message || "Couldn't add this to your cart.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(item) {
    setActionError("");
    setBusyId(item.id);
    try {
      await removeFromWishlist(item.productId);
    } catch (err) {
      setActionError(err.message || "Couldn't remove that item.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <div className="container page-section">
        <h1>Your wishlist</h1>
        <div className="skeleton" style={{ height: 96, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 96 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-section">
        <EmptyState icon="⚠️" title="Something went wrong" message={error} actionTo="/" actionLabel="Back to home" />
      </div>
    );
  }

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

      {actionError && <p className="field-error" style={{ marginBottom: 16 }}>{actionError}</p>}

      <ul className="wishlist-list">
        {items.map((item) => (
          <li className="wishlist-line tag-card" key={item.id}>
            <Link to={`/product/${item.product.id}`} className="cart-line__image">
              <img src={item.product.images[0]} alt={item.product.name} />
            </Link>
            <div className="cart-line__info">
              <Link to={`/product/${item.product.id}`} className="cart-line__name">
                {item.product.name}
              </Link>
              <p className="price cart-line__unit-price">{formatPrice(item.product.price)}</p>
            </div>
            <div className="wishlist-line__actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleAddToCart(item)}
                disabled={busyId === item.id || item.product.stock === 0}
              >
                Add to cart
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleRemove(item)}
                disabled={busyId === item.id}
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
