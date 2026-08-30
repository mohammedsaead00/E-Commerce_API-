import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useCart } from "../context/AppContext";
import { api } from "../services/api";
import {
  formatPrice,
  validateRequired,
  validateEmail,
  validateZip,
  validateCardNumber,
  validateExpiry,
  validateCvc,
} from "../utils/format";
import EmptyState from "../components/EmptyState";

const SHIPPING_FLAT = 6.0;
const FREE_SHIPPING_THRESHOLD = 75;

const initialForm = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export default function Checkout() {
  const { user } = useAuth();
  const { cart, loading, error: cartError, placeOrder } = useCartCheckout();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ...initialForm,
    fullName: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  const lines = cart.filter((line) => line.product);

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const next = {
      fullName: validateRequired(form.fullName, "Full name"),
      email: validateEmail(form.email),
      address: validateRequired(form.address, "Address"),
      city: validateRequired(form.city, "City"),
      zip: validateZip(form.zip),
      cardName: validateRequired(form.cardName, "Name on card"),
      cardNumber: validateCardNumber(form.cardNumber),
      expiry: validateExpiry(form.expiry),
      cvc: validateCvc(form.cvc),
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setPlaceError("");
    if (!validate()) return;

    setPlacing(true);
    try {
      const shippingAddress = `${form.fullName}, ${form.address}, ${form.city} ${form.zip}`;
      const order = await placeOrder({
        shippingAddress,
        paymentMethod: "card",
      });
      navigate("/orders", { state: { justPlacedOrderId: order.id } });
    } catch (err) {
      setPlaceError(err.message || "Something went wrong placing your order.");
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return (
      <div className="container page-section">
        <div className="skeleton" style={{ height: 320 }} />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="container page-section">
        <EmptyState icon="⚠️" title="Something went wrong" message={cartError} actionTo="/cart" actionLabel="Back to cart" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container page-section">
        <EmptyState
          icon="🧾"
          title="Nothing to check out"
          message="Add a few items to your cart before heading to checkout."
          actionTo="/"
          actionLabel="Continue shopping"
        />
      </div>
    );
  }

  return (
    <div className="container page-section">
      <h1>Checkout</h1>

      <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-form">
          <section className="checkout-block tag-card">
            <h2>Shipping details</h2>
            <div className="form-grid">
              <div className={`form-field ${errors.fullName ? "has-error" : ""}`}>
                <label htmlFor="co-name">Full name</label>
                <input id="co-name" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>
              <div className={`form-field ${errors.email ? "has-error" : ""}`}>
                <label htmlFor="co-email">Email</label>
                <input
                  id="co-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className={`form-field form-field--full ${errors.address ? "has-error" : ""}`}>
                <label htmlFor="co-address">Address</label>
                <input id="co-address" value={form.address} onChange={(e) => update("address", e.target.value)} />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>
              <div className={`form-field ${errors.city ? "has-error" : ""}`}>
                <label htmlFor="co-city">City</label>
                <input id="co-city" value={form.city} onChange={(e) => update("city", e.target.value)} />
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
              <div className={`form-field ${errors.zip ? "has-error" : ""}`}>
                <label htmlFor="co-zip">ZIP / postal code</label>
                <input id="co-zip" value={form.zip} onChange={(e) => update("zip", e.target.value)} />
                {errors.zip && <span className="field-error">{errors.zip}</span>}
              </div>
            </div>
          </section>

          <section className="checkout-block tag-card">
            <h2>Payment</h2>
            <div className="form-grid">
              <div className={`form-field form-field--full ${errors.cardName ? "has-error" : ""}`}>
                <label htmlFor="co-card-name">Name on card</label>
                <input
                  id="co-card-name"
                  value={form.cardName}
                  onChange={(e) => update("cardName", e.target.value)}
                />
                {errors.cardName && <span className="field-error">{errors.cardName}</span>}
              </div>
              <div className={`form-field form-field--full ${errors.cardNumber ? "has-error" : ""}`}>
                <label htmlFor="co-card-number">Card number</label>
                <input
                  id="co-card-number"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  value={form.cardNumber}
                  onChange={(e) => update("cardNumber", e.target.value)}
                />
                {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
              </div>
              <div className={`form-field ${errors.expiry ? "has-error" : ""}`}>
                <label htmlFor="co-expiry">Expiry (MM/YY)</label>
                <input
                  id="co-expiry"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={(e) => update("expiry", e.target.value)}
                />
                {errors.expiry && <span className="field-error">{errors.expiry}</span>}
              </div>
              <div className={`form-field ${errors.cvc ? "has-error" : ""}`}>
                <label htmlFor="co-cvc">CVC</label>
                <input
                  id="co-cvc"
                  inputMode="numeric"
                  placeholder="123"
                  value={form.cvc}
                  onChange={(e) => update("cvc", e.target.value)}
                />
                {errors.cvc && <span className="field-error">{errors.cvc}</span>}
              </div>
            </div>
            <p className="text-muted checkout-note">
              This is a demo checkout — no real payment is processed and no card data leaves your browser. Your
              order is created for real in the backend.
            </p>
          </section>
        </div>

        <aside className="cart-summary tag-card checkout-summary">
          <h2>Order summary</h2>
          <ul className="checkout-summary__list">
            {lines.map((line) => (
              <li key={line.id}>
                <span>
                  {line.product.name} × {line.qty}
                </span>
                <span className="price">{formatPrice(line.product.price * line.qty)}</span>
              </li>
            ))}
          </ul>
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
          <div className="cart-summary__row cart-summary__row--total tag-perforation">
            <span>Total</span>
            <span className="price">{formatPrice(total)}</span>
          </div>

          {placeError && <p className="field-error" style={{ marginBottom: 12 }}>{placeError}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={placing}>
            {placing ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
        </aside>
      </form>
    </div>
  );
}

// Small local wrapper: the order-creation endpoint reads the user's cart
// server-side and clears it as part of the transaction, so after a
// successful order we just need to pull the (now-empty) cart back down.
function useCartCheckout() {
  const cartApi = useCart();

  async function placeOrder(details) {
    const order = await api.placeOrder(details);
    await cartApi.refresh();
    return order;
  }

  return { ...cartApi, placeOrder };
}