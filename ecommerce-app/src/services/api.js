// ---------------------------------------------------------------------------
// Mock API layer.
//
// Every function here returns a Promise, exactly like a real fetch() call
// would. Today they resolve from local seed data / localStorage; swapping to
// a real backend later means rewriting the *inside* of these functions only
// (e.g. `return fetch('/api/products').then(r => r.json())`) — nothing that
// imports from this file needs to change.
// ---------------------------------------------------------------------------

import { PRODUCTS, CATEGORIES, getProductById, searchProducts } from "../data/products";

const LATENCY = 250;

function delay(value, ms = LATENCY) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const USERS_KEY = "loome_users_v1";
const ORDERS_KEY = "loome_orders_v1";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export const api = {
  // ---- Catalog -----------------------------------------------------------
  getProducts() {
    return delay([...PRODUCTS]);
  },
  getCategories() {
    return delay([...CATEGORIES]);
  },
  getProduct(id) {
    const product = getProductById(id);
    return product ? delay(product) : Promise.reject(new Error("Product not found"));
  },
  searchProducts(query) {
    return delay(searchProducts(query));
  },

  // ---- Auth ---------------------------------------------------------------
  register({ name, email, password }) {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return Promise.reject(new Error("An account with this email already exists."));
    }
    const user = { id: `u-${Date.now()}`, name, email, password };
    writeUsers([...users, user]);
    const { password: _pw, ...safeUser } = user;
    return delay(safeUser);
  },
  login({ email, password }) {
    const users = readUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      return Promise.reject(new Error("Invalid email or password."));
    }
    const { password: _pw, ...safeUser } = user;
    return delay(safeUser);
  },

  // ---- Orders ---------------------------------------------------------------
  placeOrder(order) {
    const orders = readOrders();
    const newOrder = {
      id: `ord-${Date.now()}`,
      placedAt: new Date().toISOString(),
      status: "Processing",
      ...order,
    };
    writeOrders([newOrder, ...orders]);
    return delay(newOrder);
  },
  getOrders(userEmail) {
    const orders = readOrders().filter((o) => o.userEmail === userEmail);
    return delay(orders);
  },
};
