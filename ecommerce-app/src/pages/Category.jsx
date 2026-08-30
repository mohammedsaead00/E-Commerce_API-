import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryPill from "../components/CategoryPill";
import EmptyState from "../components/EmptyState";

const SORT_PARAM = {
  featured: undefined,
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  rating: "rating",
};

export default function Category() {
  const { categoryId } = useParams();
  const [sort, setSort] = useState("featured");

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setNotFound(false);

    api
      .getProducts({ category: categoryId, sort: SORT_PARAM[sort] })
      .then(({ products: list }) => {
        if (!active) return;
        setProducts(list);
        setCategory(categories.find((c) => c.id === categoryId) || null);
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 404) setNotFound(true);
        else setError(err.message || "Couldn't load this category.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, sort, categories.length]);

  return (
    <div className="container page-section">
      <div className="category-row category-row--wrap">
        {categories.map((c) => (
          <CategoryPill key={c.id} category={c} active={c.id === categoryId} />
        ))}
      </div>

      <div className="page-heading-row">
        <div>
          <p className="eyebrow">Category</p>
          <h1>{category ? category.label : categoryId}</h1>
          <p className="text-muted">{loading ? "Loading…" : `${products.length} items`}</p>
        </div>

        <label className="sort-select">
          <span className="visually-hidden">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      {loading && <div className="skeleton" style={{ height: 320 }} />}

      {!loading && error && (
        <EmptyState icon="⚠️" title="Something went wrong" message={error} actionTo="/" actionLabel="Back to home" />
      )}

      {!loading && !error && notFound && (
        <EmptyState
          icon="🏷️"
          title="Nothing here yet"
          message="We couldn't find a category with that name."
          actionTo="/"
          actionLabel="Back to home"
        />
      )}

      {!loading && !error && !notFound && products.length === 0 && (
        <EmptyState
          icon="🏷️"
          title="No products in this category yet"
          message="Check back soon, or browse everything instead."
          actionTo="/search"
          actionLabel="Browse everything"
        />
      )}

      {!loading && !error && !notFound && products.length > 0 && (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!loading && !notFound && !category && (
        <p className="text-muted" style={{ marginTop: 12 }}>
          Looking for something specific? <Link to="/search">Try search</Link>.
        </p>
      )}
    </div>
  );
}
