import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import { api } from "../services/api";
import { formatDate, formatPrice } from "../utils/format";
import EmptyState from "../components/EmptyState";

export default function Orders() {
  const { user } = useAuth();
  const location = useLocation();
  const justPlacedOrderId = location.state?.justPlacedOrderId;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.getOrders(user.email).then((data) => {
      if (active) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [user.email]);

  if (loading) {
    return (
      <div className="container page-section">
        <h1>Your orders</h1>
        <div className="order-skeleton-list">
          <div className="skeleton" style={{ height: 96, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 96 }} />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container page-section">
        <EmptyState
          icon="🧾"
          title="No orders yet"
          message="Once you place an order, it'll show up here with its status."
          actionTo="/"
          actionLabel="Start shopping"
        />
      </div>
    );
  }

  return (
    <div className="container page-section">
      <h1>Your orders</h1>
      <p className="text-muted" style={{ marginBottom: 24 }}>
        {orders.length} {orders.length === 1 ? "order" : "orders"}
      </p>

      {justPlacedOrderId && (
        <div className="order-confirm-banner">
          🎉 Order placed! Your confirmation number is <strong>{justPlacedOrderId}</strong>.
        </div>
      )}

      <ul className="order-list">
        {orders.map((order) => (
          <li className="order-card tag-card" key={order.id}>
            <div className="order-card__header tag-perforation">
              <div>
                <p className="eyebrow">Order {order.id}</p>
                <p className="text-muted">{formatDate(order.placedAt)}</p>
              </div>
              <span className={`order-status order-status--${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <ul className="order-card__items">
              {order.items.map((item) => (
                <li key={`${order.id}-${item.productId}-${item.variant?.size}-${item.variant?.color}`}>
                  <Link to={`/product/${item.productId}`} className="order-card__item-image">
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div>
                    <Link to={`/product/${item.productId}`} className="cart-line__name">
                      {item.name}
                    </Link>
                    <p className="text-muted">
                      Qty {item.qty}
                      {(item.variant?.size || item.variant?.color) &&
                        ` · ${[item.variant?.color, item.variant?.size].filter(Boolean).join(" · ")}`}
                    </p>
                  </div>
                  <span className="price">{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="order-card__footer">
              <span>Shipped to {order.shippingAddress.city}</span>
              <span className="price">Total {formatPrice(order.total)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
