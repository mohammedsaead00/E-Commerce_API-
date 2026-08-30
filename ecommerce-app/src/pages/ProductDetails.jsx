import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth, useCart, useWishlist } from "../context/AppContext";
import { formatPrice } from "../utils/format";
import QuantityStepper from "../components/QuantityStepper";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    let active = true;
    setLoading(true);
    setError("");
    setNotFound(false);
    setActiveImage(0);
    setQty(1);
    setActionError("");

    api
      .getProduct(productId)
      .then((p) => {
        if (!active) return;
        setProduct(p);
        return api.getProducts({ category: p.category, limit: 8 }).then(({ products }) => {
          if (active) setRelated(products.filter((item) => item.id !== p.id).slice(0, 4));
        });
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 404) setNotFound(true);
        else setError(err.message || "Couldn't load this product.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="container page-section">
        <div className="skeleton" style={{ height: 480 }} />
      </div>
    );
  }

  if (notFound || (!loading && !product && !error)) {
    return (
      <div className="container page-section">
        <EmptyState
          icon="📦"
          title="Product not found"
          message="This item may have sold out or the link is outdated."
          actionTo="/"
          actionLabel="Back to home"
        />
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

  const wishlisted = isWishlisted(product.id);

  async function handleAddToCart(goToCart = false) {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    setActionError("");
    setAdding(true);
    try {
      await addToCart(product.id, qty);
      if (goToCart) {
        navigate("/cart");
      } else {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2200);
      }
    } catch (err) {
      setActionError(err.message || "Couldn't add this to your cart.");
    } finally {
      setAdding(false);
    }
  }

  async function handleToggleWishlist() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/product/${product.id}` } });
      return;
    }
    setWishBusy(true);
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      setActionError(err.message || "Couldn't update your wishlist.");
    } finally {
      setWishBusy(false);
    }
  }

  return (
    <div className="container page-section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> <span>/</span>{" "}
        <Link to={`/category/${product.category}`}>{product.categoryLabel || product.category}</Link>{" "}
        <span>/</span> <span className="breadcrumb__current">{product.name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp__gallery">
          <div className="pdp__main-image tag-card">
            <img src={product.images[activeImage]} alt={product.name} />
          </div>
          {product.images.length > 1 && (
            <div className="pdp__thumbs">
              {product.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`pdp__thumb ${i === activeImage ? "is-active" : ""}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp__info">
          {product.tag && <span className="product-card__tag pdp__tag">{product.tag}</span>}
          <h1>{product.name}</h1>
          <div className="pdp__rating">
            <span className="eyebrow">★ {Number(product.rating ?? 0).toFixed(1)}</span>
            <span className="eyebrow">{product.reviewCount ?? 0} reviews</span>
            <span className={`eyebrow ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="pdp__price-row tag-perforation">
            <span className="price pdp__price">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="price-strike">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="pdp__description">{product.description}</p>

          <div className="pdp__option">
            <p className="pdp__option-label">Quantity</p>
            <QuantityStepper value={qty} onChange={setQty} max={product.stock} size="lg" />
          </div>

          {actionError && <p className="field-error">{actionError}</p>}

          <div className="pdp__actions">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => handleAddToCart(false)}
              disabled={product.stock === 0 || adding}
            >
              {adding ? "Adding…" : justAdded ? "Added ✓" : "Add to cart"}
            </button>
            <button
              type="button"
              className="btn btn-accent btn-block"
              onClick={() => handleAddToCart(true)}
              disabled={product.stock === 0 || adding}
            >
              Buy now
            </button>
            <button
              type="button"
              className={`btn btn-outline pdp__wish-btn ${wishlisted ? "is-active" : ""}`}
              onClick={handleToggleWishlist}
              aria-pressed={wishlisted}
              disabled={wishBusy}
            >
              {wishlisted ? "♥ Wishlisted" : "♡ Add to wishlist"}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>You might also like</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
