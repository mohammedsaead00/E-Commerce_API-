import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryPill from "../components/CategoryPill";
import HorizontalScroller from "../components/HorizontalScroller";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [newest, setNewest] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    Promise.all([
      api.getCategories(),
      api.getProducts({ sort: "rating", limit: 8 }),
      api.getProducts({ sort: "newest", limit: 8 }),
      api.getProducts({ limit: 24 }),
    ])
      .then(([cats, rated, fresh, all]) => {
        if (!active) return;
        setCategories(cats);
        setTopRated(rated.products);
        setNewest(fresh.products);
        setOnSale(all.products.filter((p) => p.compareAtPrice));
        setAllProducts(all.products);
      })
      .catch((err) => {
        if (active) setError(err.message || "Couldn't load the shop right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

      {error && (
        <div className="container page-section">
          <EmptyState
            icon="⚠️"
            title="Something went wrong"
            message={error}
            actionTo="/"
            actionLabel="Try again"
          />
        </div>
      )}

      {!error && (
        <>
          <section className="section">
            <div className="container">
              <div className="section-head">
                <h2>Shop by category</h2>
              </div>
              {loading ? (
                <div className="skeleton" style={{ height: 56 }} />
              ) : (
                <div className="category-row">
                  {categories.map((c) => (
                    <CategoryPill key={c.id} category={c} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {loading ? (
            <section className="section">
              <div className="container">
                <div className="skeleton" style={{ height: 320 }} />
              </div>
            </section>
          ) : (
            <>
              {topRated.length > 0 && (
                <section className="section">
                  <div className="container">
                    <div className="section-head">
                      <div>
                        <p className="eyebrow">Customer favorites</p>
                        <h2>Top rated</h2>
                      </div>
                    </div>
                    <HorizontalScroller>
                      {topRated.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </HorizontalScroller>
                  </div>
                </section>
              )}

              {newest.length > 0 && (
                <section className="section">
                  <div className="container">
                    <div className="section-head">
                      <div>
                        <p className="eyebrow">Just tagged in</p>
                        <h2>New arrivals</h2>
                      </div>
                    </div>
                    <HorizontalScroller>
                      {newest.map((p) => (
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
                  {allProducts.length === 0 ? (
                    <EmptyState
                      icon="📦"
                      title="No products yet"
                      message="Check back soon — the shelves are being stocked."
                    />
                  ) : (
                    <div className="product-grid">
                      {allProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}
