import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/AppContext";
import { getProductById } from "../data/products";
import { formatPrice } from "../utils/format";
import QuantityStepper from "../components/QuantityStepper";
import EmptyState from "../components/EmptyState";

const SHIPPING_FLAT = 6.0;
const FREE_SHIPPING_THRESHOLD = 75;

export default function Cart() {
  const { cart, setQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const lines = cart
    .map((line) => ({ line, product: getProductById(line.productId) }))
    .filter((entry) => entry.product);

  const subtotal = lines.reduce((sum, { line, product }) => sum + product.price * line.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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

      <div className="cart-layout">
        <ul className="cart-list">
          {lines.map(({ line, product }) => (
            <li className="cart-line tag-card" key={`${line.productId}-${line.variant?.size}-${line.variant?.color}`}>
              <Link to={`/product/${product.id}`} className="cart-line__image">
                <img src={product.images[0]} alt={product.name} />
              </Link>

              <div className="cart-line__info">
                <Link to={`/product/${product.id}`} className="cart-line__name">
                  {product.name}
                </Link>
                {(line.variant?.size || line.variant?.color) && (
                  <p className="text-muted cart-line__variant">
                    {[line.variant?.color, line.variant?.size].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="price cart-line__unit-price">{formatPrice(product.price)}</p>

                <div className="cart-line__controls">
                  <QuantityStepper
                    value={line.qty}
                    max={product.stock}
                    onChange={(nextQty) => setQty(line.productId, line.variant, nextQty)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeFromCart(line.productId, line.variant)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-line__total price">{formatPrice(product.price * line.qty)}</div>
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
