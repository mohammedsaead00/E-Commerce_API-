# Loomé — E-commerce Frontend

A complete e-commerce storefront frontend built with **React**, **React Router**,
and plain CSS (no UI framework). Store concept: *Loomé* — a curated marketplace
for home goods, fashion, electronics, beauty, sports, and stationery, with a
"hang-tag" visual signature (die-cut card corner, perforated price line,
monospaced pricing) running through the product cards, PDP, cart, and orders.

> Note: this was generated without visual access to the linked Stitch design
> (the project link requires the owner's Google login), so the visual design
> here is an original direction rather than a copy of that mockup. Send a
> screenshot or exported spec from Stitch if you'd like the styling adjusted
> to match it more closely.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

Requires Node 18+.

## What's included

- **Sticky navbar** — logo, delivery location, search, login/account, wishlist, cart (with live counts).
- **Home page** — hero, category rail, horizontal-scrolling "Best sellers" / "New arrivals" / "On sale" rails, full product grid.
- **Category browsing** (`/category/:categoryId`) with sorting (featured / price / rating).
- **Search** (`/search?q=...`), wired to the navbar search box.
- **Product details** (`/product/:productId`) — image gallery, price (with strike-through compare price), description, size/color options, quantity stepper, add to cart, buy now, wishlist toggle, related products.
- **Cart** (`/cart`) — quantities, per-line and order totals, free-shipping threshold, checkout button.
- **Wishlist** (`/wishlist`) — add to cart or remove.
- **Login / Register** (`/login`, `/register`) — client-side validation, accounts persisted in `localStorage` for the demo.
- **Checkout** (`/checkout`) — shipping + payment form validation, order summary, places an order.
- **Orders** (`/orders`, requires login) — order history with status and line items.
- Responsive from desktop down to small mobile; a hamburger menu replaces the navbar actions below 720px.

## Project structure

```
src/
  main.jsx              Router + global providers + global CSS imports
  App.jsx                Route table and page layout (Navbar / Footer)
  index.css              Design tokens (colors, type, spacing) + shared primitives
  context/
    AppContext.jsx        Auth/cart/wishlist state (useReducer + localStorage)
  data/
    products.js           Seed catalog data (products + categories)
  services/
    api.js                Mock API layer — every call returns a Promise;
                           swap the *inside* of these functions for real
                           `fetch()` calls when a backend exists, and no
                           importing component needs to change.
  utils/
    format.js              Price/date formatting + form validators
  components/             Reusable UI: Navbar, Footer, ProductCard,
                           CategoryPill, HorizontalScroller, QuantityStepper,
                           EmptyState, ProtectedRoute
  pages/                  One file per route (Home, Category, Search,
                           ProductDetails, Cart, Wishlist, Login, Register,
                           Checkout, Orders, NotFound) + pages.css for
                           page-level layout
```

## State management notes

Cart, wishlist, and the logged-in user live in a single `useReducer` store
(`src/context/AppContext.jsx`), persisted to `localStorage` so it survives a
refresh. The shape is intentionally flat and serializable:

```js
{
  user: { id, name, email } | null,
  cart: [{ productId, qty, variant: { size, color } }],
  wishlist: [productId, ...],
}
```

That maps cleanly onto typical backend resources (a cart-lines table, a
wishlist join table, a session/auth response), so connecting a real API later
is mostly a matter of rewriting `src/services/api.js` and, if you want
server-persisted carts instead of local ones, dispatching actions from the
resolved API responses instead of directly from user events.

## Testing notes

Manually verified before delivery:

- `npm run build` completes with no errors or warnings.
- A full ESLint pass (`eslint:recommended` + `react` + `react-hooks`) was run
  over `src/` and all resulting errors were fixed (two `set-state-in-effect`
  issues and one unescaped-entity issue); only two harmless "unused var"
  style warnings remain, from the intentional `{ password: _pw, ...rest }`
  pattern used to strip passwords before returning a user object.
- Navigation between every route, add/remove cart and wishlist items,
  quantity/total recalculation, and all three forms' validation (login,
  register, checkout) were traced through the code path by hand.
- Automated in-browser (Playwright) testing could not run in this sandbox
  (its browser binary download is blocked by the network allowlist here) —
  if you want that extra layer of confidence, running `npm run dev` and
  clicking through the checklist below on your machine takes a couple of
  minutes.

Suggested manual pass on your machine:

- [ ] Navigate through every nav link, footer link, and breadcrumb.
- [ ] Open a product, change its size/color/quantity, add to cart.
- [ ] Add and remove items from the cart; confirm totals update.
- [ ] Add and remove items from the wishlist from both the product card and the PDP.
- [ ] Register a new account, then log out and log back in with it.
- [ ] Fill checkout with invalid data (bad email, expired card, etc.) and confirm inline errors appear.
- [ ] Complete a checkout and confirm it shows up on the Orders page.
- [ ] Resize the browser down to a phone width and re-check the above.
- [ ] Open the browser devtools console and confirm it stays clean while doing all of the above.
