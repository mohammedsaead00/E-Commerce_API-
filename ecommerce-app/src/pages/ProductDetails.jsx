import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, getRelatedProducts } from "../data/products";
import { useCart, useWishlist } from "../context/AppContext";
import { formatPrice } from "../utils/format";
import QuantityStepper from "../components/QuantityStepper";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = getProductById(productId);

  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  // This component is remounted (via a `key={productId}` on the route
  // wrapper) whenever the user navigates from one product to another, so
  // these initializers run fresh per product without needing a reset effect.
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(product?.sizes?.[0] ?? null);
  const [color, setColor] = useState(product?.colors?.[0] ?? null);
  const [justAdded, setJustAdded] = useState(false);
  const [variantError, setVariantError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (!product) {
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

  const related = getRelatedProducts(product);
  const wishlisted = isWishlisted(product.id);

  function handleAddToCart() {
    if ((product.sizes && !size) || (product.colors && !color)) {
      setVariantError("Please choose the available options above.");
      return;
    }
    setVariantError("");
    addToCart(product.id, qty, { size, color });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  }

  function handleBuyNow() {
    if ((product.sizes && !size) || (product.colors && !color)) {
      setVariantError("Please choose the available options above.");
      return;
    }
    addToCart(product.id, qty, { size, color });
    navigate("/cart");
  }

  return (
    <div className="container page-section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link> <span>/</span>{" "}
        <Link to={`/category/${product.category}`}>{product.category.replace("-", " & ")}</Link>{" "}
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
            <span className="eyebrow">★ {product.rating.toFixed(1)}</span>
            <span className="eyebrow">{product.reviewCount} reviews</span>
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

          {product.colors && (
            <div className="pdp__option">
              <p className="pdp__option-label">Color: {color}</p>
              <div className="pdp__swatches">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`pdp__swatch ${color === c ? "is-active" : ""}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && (
            <div className="pdp__option">
              <p className="pdp__option-label">Size: {size}</p>
              <div className="pdp__swatches">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`pdp__swatch ${size === s ? "is-active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pdp__option">
            <p className="pdp__option-label">Quantity</p>
            <QuantityStepper value={qty} onChange={setQty} max={product.stock} size="lg" />
          </div>

          {variantError && <p className="field-error">{variantError}</p>}

          <div className="pdp__actions">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {justAdded ? "Added ✓" : "Add to cart"}
            </button>
            <button
              type="button"
              className="btn btn-accent btn-block"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy now
            </button>
            <button
              type="button"
              className={`btn btn-outline pdp__wish-btn ${wishlisted ? "is-active" : ""}`}
              onClick={() => toggleWishlist(product.id)}
              aria-pressed={wishlisted}
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
