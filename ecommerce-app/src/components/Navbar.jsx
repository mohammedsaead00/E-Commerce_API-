import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useCart, useWishlist } from "../context/AppContext";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <button
          className="navbar__burger"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <Link to="/" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-mark">L</span>
          <span className="navbar__logo-word">Loomé</span>
        </Link>

        <button className="navbar__location" type="button" title="Delivery location">
          <span aria-hidden="true">📍</span>
          <span className="navbar__location-text">
            <span className="navbar__location-label">Deliver to</span>
            <span className="navbar__location-value">Alexandria, EG</span>
          </span>
        </button>

        <form className="navbar__search" onSubmit={handleSearchSubmit} role="search">
          <label htmlFor="site-search" className="visually-hidden">
            Search products
          </label>
          <input
            id="site-search"
            type="search"
            placeholder="Search for products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            🔍
          </button>
        </form>

        <nav className={`navbar__actions ${menuOpen ? "is-open" : ""}`}>
          <form className="navbar__search navbar__search--mobile" onSubmit={handleSearchSubmit} role="search">
            <label htmlFor="site-search-mobile" className="visually-hidden">
              Search products
            </label>
            <input
              id="site-search-mobile"
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              🔍
            </button>
          </form>

          <Link
            to={isAuthenticated ? "/orders" : "/login"}
            className="navbar__action"
            onClick={() => setMenuOpen(false)}
          >
            <span aria-hidden="true">👤</span>
            <span className="navbar__action-label">
              {isAuthenticated ? `Hi, ${user.name.split(" ")[0]}` : "Login"}
            </span>
          </Link>

          <Link to="/wishlist" className="navbar__action" onClick={() => setMenuOpen(false)}>
            <span className="navbar__icon-wrap">
              <span aria-hidden="true">♡</span>
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </span>
            <span className="navbar__action-label">Wishlist</span>
          </Link>

          <Link to="/cart" className="navbar__action navbar__action--cart" onClick={() => setMenuOpen(false)}>
            <span className="navbar__icon-wrap">
              <span aria-hidden="true">🛍</span>
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </span>
            <span className="navbar__action-label">Cart</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
