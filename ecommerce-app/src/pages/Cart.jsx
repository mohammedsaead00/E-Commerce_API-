import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/AppContext";
import { formatPrice } from "../utils/format";
import QuantityStepper from "../components/QuantityStepper";
import EmptyState from "../components/EmptyState";

const SHIPPING_FLAT = 6.0;
const FREE_SHIPPING_THRESHOLD = 75;

export default function Cart() {
  const { cart, loading, error, setCartItemQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [lineError, setLineError] = useState("");
  const [busyLineId, setBusyLineId] = useState(null);

  const lines = cart.filter((line) => line.product);

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  async function handleQtyChange(line, nextQty) {
    setLineError("");
    setBusyLineId(line.id);
    try {
      await setCartItemQty(line.id, nextQty);
    } catch (err) {
      setLineError(err.message || "Couldn't update quantity.");
    } finally {
      setBusyLineId(null);
    }
  }

  async function handleRemove(line) {
    setLineError("");
    setBusyLineId(line.id);
    try {
      await removeFromCart(line.id);
    } catch (err) {
      setLineError(err.message || "Couldn't remove that item.");
    } finally {
      setBusyLineId(null);
    }
  }

  if (loading) {
    return (
      <div className="container page-section">
        <h1>Your cart</h1>
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

  if (lines.length === 0) {
    return (
      <div className="container page-section">
        <EmptyState
          icon="🛍"
          title="Your cart is empty"
          message="Items you add will show up here, ready when you are."
          actionTo="/"
          actionLabel="Continue shopping"
        />
      </div>
    );
  }

  return (
    <div className="container page-section">
      <h1>Your cart</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        {lines.length} {lines.length === 1 ? "item" : "items"}
      </p>

      {lineError && <p className="field-error" style={{ marginBottom: 16 }}>{lineError}</p>}

      <div className="cart-layout">
        <ul className="cart-list">
          {lines.map((line) => (
            <li className="cart-line tag-card" key={line.id}>
              <Link to={`/product/${line.product.id}`} className="cart-line__image">
                <img src={line.product.images[0]} alt={line.product.name} />
              </Link>

              <div className="cart-line__info">
                <Link to={`/product/${line.product.id}`} className="cart-line__name">
                  {line.product.name}
                </Link>
                <p className="price cart-line__unit-price">{formatPrice(line.product.price)}</p>

                <div className="cart-line__controls">
                  <QuantityStepper
                    value={line.qty}
                    max={line.product.stock}
                    onChange={(nextQty) => handleQtyChange(line, nextQty)}
                    disabled={busyLineId === line.id}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleRemove(line)}
                    disabled={busyLineId === line.id}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-line__total price">{formatPrice(line.product.price * line.qty)}</div>
            </li>
          ))}
        </ul>

        <aside className="cart-summary tag-card">
          <h2>Order summary</h2>
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span className="price">{formatPrice(subtotal)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span className="price">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Estimated tax</span>
            <span className="price">{formatPrice(tax)}</span>
          </div>
          {shipping > 0 && (
            <p className="cart-summary__hint">
              Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
            </p>
          )}
          <div className="cart-summary__row cart-summary__row--total tag-perforation">
            <span>Total</span>
            <span className="price">{formatPrice(total)}</span>
          </div>
          <button type="button" className="btn btn-primary btn-block" onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </button>
          <Link to="/" className="btn btn-ghost btn-block">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
