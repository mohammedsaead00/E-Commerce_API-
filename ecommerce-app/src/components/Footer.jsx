import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <span className="navbar__logo-mark">L</span>
          <div>
            <p className="site-footer__word">Loomé</p>
            <p className="eyebrow">Everyday goods, thoughtfully tagged.</p>
          </div>
        </div>

        <div className="site-footer__links">
          <div>
            <p className="site-footer__heading">Shop</p>
            <Link to="/category/home-living">Home &amp; Living</Link>
            <Link to="/category/fashion">Fashion</Link>
            <Link to="/category/electronics">Electronics</Link>
          </div>
          <div>
            <p className="site-footer__heading">Account</p>
            <Link to="/orders">Your orders</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/login">Login / Register</Link>
          </div>
          <div>
            <p className="site-footer__heading">Help</p>
            <a href="#!" onClick={(e) => e.preventDefault()}>
              Shipping &amp; returns
            </a>
            <a href="#!" onClick={(e) => e.preventDefault()}>
              Contact us
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <p className="site-footer__legal">© {new Date().getFullYear()} Loomé. All rights reserved.</p>
      </div>
    </footer>
  );
}
