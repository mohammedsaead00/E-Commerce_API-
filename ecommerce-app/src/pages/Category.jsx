import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CATEGORIES, getProductsByCategory } from "../data/products";
import ProductCard from "../components/ProductCard";
import CategoryPill from "../components/CategoryPill";
import EmptyState from "../components/EmptyState";

const SORTS = {
  featured: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export default function Category() {
  const { categoryId } = useParams();
  const [sort, setSort] = useState("featured");
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const products = useMemo(() => {
    const list = getProductsByCategory(categoryId);
    return [...list].sort(SORTS[sort]);
  }, [categoryId, sort]);

  return (
    <div className="container page-section">
      <div className="category-row category-row--wrap">
        {CATEGORIES.map((c) => (
          <CategoryPill key={c.id} category={c} active={c.id === categoryId} />
        ))}
      </div>

      <div className="page-heading-row">
        <div>
          <p className="eyebrow">Category</p>
          <h1>{category ? category.label : "All products"}</h1>
          <p className="text-muted">{products.length} items</p>
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

      {products.length === 0 ? (
        <EmptyState
          icon="🏷️"
          title="Nothing here yet"
          message="We couldn't find a category with that name."
          actionTo="/"
          actionLabel="Back to home"
        />
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {!category && (
        <p className="text-muted" style={{ marginTop: 12 }}>
          Looking for something specific? <Link to="/search">Try search</Link>.
        </p>
      )}
    </div>
  );
}
