import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [draft, setDraft] = useState(query);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const request = query ? api.searchProducts(query) : api.getProducts({ limit: 48 }).then((r) => r.products);

    request
      .then((list) => {
        if (active) setResults(list);
      })
      .catch((err) => {
        if (active) setError(err.message || "Search failed. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

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
          <p className="text-muted">{loading ? "Searching…" : `${results.length} items found`}</p>
        </div>
      </div>

      {loading && <div className="skeleton" style={{ height: 320 }} />}

      {!loading && error && (
        <EmptyState icon="⚠️" title="Something went wrong" message={error} actionTo="/" actionLabel="Back to home" />
      )}

      {!loading && !error && results.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No matches"
          message="Try a different word, or browse by category from the home page."
          actionTo="/"
          actionLabel="Back to home"
        />
      )}

      {!loading && !error && results.length > 0 && (
        <div className="product-grid">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
