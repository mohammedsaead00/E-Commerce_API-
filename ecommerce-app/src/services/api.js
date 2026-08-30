// ---------------------------------------------------------------------------
// Real API client — talks to the Express/Sequelize backend defined in
// server.js / routes / controllers. Base URL comes from an environment
// variable so the frontend and backend stay decoupled and deployable
// separately.
// ---------------------------------------------------------------------------

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const TOKEN_KEY = "loome_token_v1";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// A small typed error so callers/UI can show the server's message.
export class ApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = "GET", body, auth = false, query } = {}) {
  let url = `${API_BASE_URL}${path}`;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") params.set(key, value);
    });
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(
      "Can't reach the server. Check your connection and that the API is running.",
      { status: 0 }
    );
  }

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.errors?.[0]?.msg ||
      `Request failed (${response.status}).`;
    // If an authenticated request is rejected as unauthorized, the stored
    // token is stale (expired/invalid) — clear it so the app falls back to
    // a logged-out state instead of repeatedly failing every request.
    if (auth && response.status === 401) {
      setToken(null);
    }
    throw new ApiError(message, { status: response.status, errors: payload?.errors });
  }

  return payload;
}

// ---------------------------------------------------------------------------
// Adapters — map backend shapes onto the shapes the UI already expects, so
// existing components (ProductCard, CategoryPill, etc.) need minimal churn.
// ---------------------------------------------------------------------------

const CATEGORY_ICONS = {
  electronics: "💻",
  fashion: "👕",
  "home-living": "🏠",
  "sports-fitness": "🏋️",
  books: "📚",
  "beauty-care": "💄",
};

function adaptCategory(c) {
  if (!c) return null;
  return {
    id: c.slug,
    dbId: c.id,
    label: c.name,
    icon: CATEGORY_ICONS[c.slug] || "🏷️",
    description: c.description,
    image: c.image,
  };
}

function adaptProduct(p) {
  if (!p) return null;
  const images = Array.isArray(p.images) && p.images.length ? p.images : [p.image].filter(Boolean);
  return {
    id: p.id,
    name: p.name,
    description: p.description || "",
    price: Number(p.price),
    compareAtPrice:
      p.originalPrice && Number(p.originalPrice) > Number(p.price) ? Number(p.originalPrice) : null,
    stock: p.stock ?? 0,
    images: images.length ? images : ["https://picsum.photos/seed/loome-fallback/600/600"],
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    category: p.category?.slug ?? p.categoryId,
    categoryLabel: p.category?.name,
    tag: p.originalPrice && Number(p.originalPrice) > Number(p.price) ? "Sale" : null,
  };
}

function adaptCartItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    qty: item.quantity,
    priceAtAdd: Number(item.priceAtAdd),
    product: adaptProduct(item.product),
  };
}

function adaptCart(cart) {
  if (!cart) return { items: [], itemCount: 0, totalAmount: 0 };
  return {
    items: (cart.items || []).map(adaptCartItem),
    itemCount: cart.itemCount ?? 0,
    totalAmount: cart.totalAmount ?? 0,
  };
}

function adaptWishlist(wishlist) {
  if (!wishlist) return { items: [] };
  return {
    items: (wishlist.items || []).map((item) => ({
      id: item.id,
      productId: item.productId,
      product: adaptProduct(item.product),
    })),
  };
}

function adaptOrder(order) {
  if (!order) return null;
  return {
    id: order.id,
    placedAt: order.createdAt,
    status: order.status,
    total: Number(order.totalAmount),
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    items: (order.items || []).map((item) => ({
      productId: item.productId,
      name: item.productName,
      image: item.productImage,
      price: Number(item.unitPrice),
      qty: item.quantity,
      subtotal: Number(item.subtotal),
    })),
  };
}

function adaptUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
  };
}

// ---------------------------------------------------------------------------

export const api = {
  // ---- Catalog -------------------------------------------------------------
  async getProducts({ search, category, sort, page, limit = 24 } = {}) {
    const payload = await request("/products", {
      query: { search, category, sort, page, limit },
    });
    return {
      products: (payload.data || []).map(adaptProduct),
      pagination: payload.pagination,
    };
  },
  async getCategories() {
    const payload = await request("/categories");
    return (payload.data || []).map(adaptCategory);
  },
  async getCategory(slugOrId) {
    const payload = await request(`/categories/${encodeURIComponent(slugOrId)}`);
    const category = adaptCategory(payload.data);
    const products = (payload.data?.products || []).map(adaptProduct);
    return { category, products };
  },
  async getProduct(id) {
    const payload = await request(`/products/${id}`);
    return adaptProduct(payload.data);
  },
  async searchProducts(query) {
    const payload = await request("/products", { query: { search: query, limit: 48 } });
    return (payload.data || []).map(adaptProduct);
  },

  // ---- Auth -----------------------------------------------------------------
  async register({ name, email, password }) {
    const payload = await request("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    setToken(payload.token);
    return adaptUser(payload.user);
  },
  async login({ email, password }) {
    const payload = await request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(payload.token);
    return adaptUser(payload.user);
  },
  async getMe() {
    const payload = await request("/auth/me", { auth: true });
    return adaptUser(payload.user);
  },
  logout() {
    setToken(null);
  },

  // ---- Cart -------------------------------------------------------------------
  async getCart() {
    const payload = await request("/cart", { auth: true });
    return adaptCart(payload.data);
  },
  async addCartItem(productId, quantity = 1) {
    const payload = await request("/cart/items", {
      method: "POST",
      auth: true,
      body: { productId, quantity },
    });
    return adaptCart(payload.data);
  },
  async updateCartItem(itemId, quantity) {
    const payload = await request(`/cart/items/${itemId}`, {
      method: "PUT",
      auth: true,
      body: { quantity },
    });
    return adaptCart(payload.data);
  },
  async removeCartItem(itemId) {
    const payload = await request(`/cart/items/${itemId}`, {
      method: "DELETE",
      auth: true,
    });
    return adaptCart(payload.data);
  },
  async clearCart() {
    const payload = await request("/cart", { method: "DELETE", auth: true });
    return adaptCart(payload.data);
  },

  // ---- Wishlist ------------------------------------------------------------
  async getWishlist() {
    const payload = await request("/wishlist", { auth: true });
    return adaptWishlist(payload.data);
  },
  async addWishlistItem(productId) {
    const payload = await request("/wishlist", {
      method: "POST",
      auth: true,
      body: { productId },
    });
    return adaptWishlist(payload.data);
  },
  async removeWishlistItem(productId) {
    const payload = await request(`/wishlist/${productId}`, {
      method: "DELETE",
      auth: true,
    });
    return adaptWishlist(payload.data);
  },

  // ---- Orders ----------------------------------------------------------------
  async placeOrder({ shippingAddress, paymentMethod, notes }) {
    const payload = await request("/orders", {
      method: "POST",
      auth: true,
      body: { shippingAddress, paymentMethod, notes },
    });
    return adaptOrder(payload.data);
  },
  async getOrders() {
    const payload = await request("/orders", { auth: true });
    return (payload.data || []).map(adaptOrder);
  },
  async getOrder(id) {
    const payload = await request(`/orders/${id}`, { auth: true });
    return adaptOrder(payload.data);
  },
};