import { Link } from "react-router-dom";
import { CATEGORIES, PRODUCTS } from "../data/products";
import ProductCard from "../components/ProductCard";
import CategoryPill from "../components/CategoryPill";
import HorizontalScroller from "../components/HorizontalScroller";

function byTag(tag) {
  return PRODUCTS.filter((p) => p.tag === tag);
}

export default function Home() {
  const bestSellers = byTag("Best seller");
  const newArrivals = byTag("New");
  const onSale = PRODUCTS.filter((p) => p.compareAtPrice);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">The autumn restock is live</p>
            <h1>
              Everyday goods,
              <br />
              thoughtfully tagged.
            </h1>
            <p className="hero__sub">
              Small-batch homeware, considered fashion, and tools worth keeping — every
              piece labeled with exactly what it is, and nothing it isn&apos;t.
            </p>
            <div className="hero__actions">
              <Link to="/category/home-living" className="btn btn-primary">
                Shop Home &amp; Living
              </Link>
              <Link to="/search" className="btn btn-outline">
                Browse everything
              </Link>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <img src="https://picsum.photos/seed/loome-hero/720/720" alt="" />
            <span className="hero__art-tag">
              <span className="eyebrow">Featured</span>
              <span className="price">$18.00</span>
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Shop by category</h2>
          </div>
          <div className="category-row">
            {CATEGORIES.map((c) => (
              <CategoryPill key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>

      {bestSellers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">Customer favorites</p>
                <h2>Best sellers</h2>
              </div>
            </div>
            <HorizontalScroller>
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </HorizontalScroller>
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">Just tagged in</p>
                <h2>New arrivals</h2>
              </div>
            </div>
            <HorizontalScroller>
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </HorizontalScroller>
          </div>
        </section>
      )}

      {onSale.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="eyebrow">Limited time</p>
                <h2>On sale</h2>
              </div>
            </div>
            <HorizontalScroller>
              {onSale.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </HorizontalScroller>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>All products</h2>
          </div>
          <div className="product-grid">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
