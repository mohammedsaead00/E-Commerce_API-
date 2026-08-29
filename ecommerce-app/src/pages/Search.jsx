import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS, searchProducts } from "../data/products";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [draft, setDraft] = useState(query);

  const results = useMemo(() => (query ? searchProducts(query) : PRODUCTS), [query]);

  function handleSubmit(e) {
    e.preventDefault();
    setSearchParams(draft.trim() ? { q: draft.trim() } : {});
  }

  return (
    <div className="container page-section">
      <form className="search-page-bar" onSubmit={handleSubmit}>
        <input
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search for products, categories..."
          aria-label="Search products"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <div className="page-heading-row">
        <div>
          <p className="eyebrow">{query ? "Results" : "Browsing"}</p>
          <h1>{query ? `“${query}”` : "All products"}</h1>
          <p className="text-muted">{results.length} items found</p>
        </div>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No matches"
          message="Try a different word, or browse by category from the home page."
          actionTo="/"
          actionLabel="Back to home"
        />
      ) : (
        <div className="product-grid">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
