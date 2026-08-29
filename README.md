# 🛒 E-Commerce REST API

A fully-featured e-commerce backend built with **Node.js**, **Express**, **Sequelize**, and **SQLite**.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Models & Relationships](#-database-models--relationships)
- [API Reference](#-api-reference)
  - [Health Check](#health-check)
  - [Auth](#auth)
  - [Categories](#categories)
  - [Products](#products)
  - [Cart](#cart)
  - [Wishlist](#wishlist)
  - [Orders](#orders)
- [Error Handling](#-error-handling)
- [Authentication](#-authentication)
- [Running Tests](#-running-tests)

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | HTTP Framework |
| Sequelize v6 | ORM |
| SQLite (sqlite3) | Database (file-based, zero setup) |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| dotenv | Environment config |

---

## 📁 Project Structure

```
backend/
├── server.js                   ← Entry point
├── .env                        ← Environment variables
├── package.json
├── api-test.http               ← REST Client test file (VS Code)
│
├── config/
│   └── database.js             ← Sequelize + SQLite instance
│
├── models/
│   ├── index.js                ← All model associations
│   ├── User.js
│   ├── Category.js
│   ├── Product.js
│   ├── Cart.js
│   ├── CartItem.js
│   ├── Wishlist.js
│   ├── WishlistItem.js
│   ├── Order.js
│   └── OrderItem.js
│
├── middleware/
│   ├── auth.js                 ← JWT protect + adminOnly guards
│   └── errorHandler.js         ← Global error handler
│
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── wishlistController.js
│   └── orderController.js
│
├── routes/
│   ├── auth.js
│   ├── categories.js
│   ├── products.js
│   ├── cart.js
│   ├── wishlist.js
│   └── orders.js
│
└── seeders/
    └── seed.js                 ← Sample data seeder
```

---

## 🚀 Getting Started

### 1. Node.js Setup (already done ✅)

Node.js v20.18.1 is installed at `C:\Users\narim\nodejs-temp\node-v20.18.1-win-x64` and **permanently added to your PATH**.

> **If a new terminal session doesn't find npm**, run this once:
> ```powershell
> $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
> ```

### 2. Install dependencies

```powershell
cd "c:\Users\narim\Desktop\project iti\backend"
npm install
```

### 3. Seed the database

```powershell
npm run seed
# or: node seeders/seed.js
```

This creates:
- 👤 **2 users** (admin + regular user)
- 🗂 **6 categories** (Electronics, Fashion, Home & Living, Sports, Books, Beauty)
- 📦 **24 products** (4 per category)

**Seed credentials:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@shop.com` | `admin123` |
| User | `user@shop.com` | `user1234` |

### 4. Start the server

```powershell
npm start
# or: node server.js

# Development mode (auto-restart):
npm run dev
```

Server runs on: **`http://localhost:5000`**

---

## ⚙️ Environment Variables

File: `.env`

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `JWT_SECRET` | *(set this!)* | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | `7d` | JWT expiry duration |
| `DB_STORAGE` | `./database.sqlite` | SQLite file path |
| `CORS_ORIGIN` | `http://localhost:3000,...` | Allowed frontend origins |

> ⚠️ **Change `JWT_SECRET` to a strong random string in production!**

---

## 🗄 Database Models & Relationships

```
User ──────────── hasOne ──────────► Cart
                                       │
                                       └── hasMany ──► CartItem ──► Product
                                                                       │
User ──────────── hasOne ──────────► Wishlist                          │
                                       │                               │
                                       └── hasMany ──► WishlistItem ──►┘
                                                                       │
User ──────────── hasMany ─────────► Order                             │
                                       │                               │
                                       └── hasMany ──► OrderItem ─────►┘

Category ─────── hasMany ──────────► Product
```

### Model Fields

#### User
| Field | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key |
| `name` | String | Required |
| `email` | String | Unique, required |
| `password` | String | bcrypt hashed |
| `role` | Enum | `user` \| `admin` |
| `phone` | String | Optional |
| `address` | Text | Optional |

#### Category
| Field | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key |
| `name` | String | Unique |
| `slug` | String | URL-friendly name |
| `description` | Text | Optional |
| `image` | String | URL |

#### Product
| Field | Type | Notes |
|---|---|---|
| `id` | Integer | Primary key |
| `name` | String | Required |
| `description` | Text | Optional |
| `price` | Decimal | Current price |
| `originalPrice` | Decimal | For showing discount |
| `stock` | Integer | Inventory count |
| `image` | String | Main image URL |
| `images` | JSON Array | Additional images |
| `rating` | Float | 0–5 |
| `reviewCount` | Integer | Review count |
| `isActive` | Boolean | Soft delete flag |
| `categoryId` | FK | → Category |

#### Order
| Field | Type | Notes |
|---|---|---|
| `status` | Enum | `pending` \| `confirmed` \| `processing` \| `shipped` \| `delivered` \| `cancelled` |
| `totalAmount` | Decimal | Order total |
| `shippingAddress` | Text | Required |
| `paymentMethod` | String | Default: `cash_on_delivery` |
| `paymentStatus` | Enum | `pending` \| `paid` \| `failed` \| `refunded` |

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

**Response format:**
```json
{
  "success": true,
  "data": { }
}
```

**Error format:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

### Health Check

#### `GET /health`
Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-08-29T00:30:05.683Z"
}
```

---

### Auth

#### `POST /auth/register`
Register a new user account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1-555-0100",     // optional
  "address": "123 Main St"    // optional
}
```

**Response `201`:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": 3,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Errors:** `400` validation error | `409` email already registered

---

#### `POST /auth/login`
Login and receive a JWT token.

**Body:**
```json
{
  "email": "user@shop.com",
  "password": "user1234"
}
```

**Response `200`:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": 2, "name": "John Doe", "role": "user" }
}
```

**Errors:** `400` validation | `401` invalid credentials

---

#### `GET /auth/me` 🔒
Get the currently logged-in user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "success": true,
  "user": { "id": 2, "name": "John Doe", "email": "user@shop.com", "role": "user" }
}
```

---

#### `PUT /auth/me` 🔒
Update the current user's profile.

**Body:**
```json
{
  "name": "John Updated",
  "phone": "+1-555-8888",
  "address": "New Address"
}
```

---

### Categories

#### `GET /categories`
Get all categories.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Electronics", "slug": "electronics", "image": "..." },
    ...
  ]
}
```

---

#### `GET /categories/:id`
Get a category with its products. Accepts `id` (number) or `slug` (string).

```
GET /categories/1
GET /categories/electronics
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics",
    "products": [ ... ]
  }
}
```

**Errors:** `404` not found

---

#### `POST /categories` 🔒 Admin
Create a new category.

**Body:**
```json
{
  "name": "Toys & Games",
  "description": "Fun toys for all ages",
  "image": "https://..."
}
```

**Response `201`:** Created category object

---

#### `PUT /categories/:id` 🔒 Admin
Update an existing category.

---

#### `DELETE /categories/:id` 🔒 Admin
Delete a category.

> ⚠️ Will fail if the category has products attached (FK constraint).

---

### Products

#### `GET /products`
Get all active products with optional filters.

**Query Parameters:**

| Param | Type | Description | Example |
|---|---|---|---|
| `search` | string | Search name & description | `?search=iphone` |
| `category` | string/number | Filter by category id or slug | `?category=electronics` |
| `minPrice` | number | Minimum price | `?minPrice=10` |
| `maxPrice` | number | Maximum price | `?maxPrice=500` |
| `sort` | string | `price_asc` \| `price_desc` \| `rating` \| `newest` | `?sort=price_asc` |
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 12) | `?limit=6` |

**Response `200`:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 24,
    "page": 1,
    "limit": 12,
    "totalPages": 2
  }
}
```

---

#### `GET /products/:id`
Get a single product's detail including its category.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro Max",
    "price": "1199.00",
    "originalPrice": "1299.00",
    "stock": 50,
    "rating": 4.8,
    "reviewCount": 1240,
    "images": [],
    "category": { "id": 1, "name": "Electronics" }
  }
}
```

**Errors:** `404` not found

---

#### `POST /products` 🔒 Admin
Create a new product.

**Body:**
```json
{
  "name": "Product Name",
  "description": "Description text",
  "price": 99.99,
  "originalPrice": 129.99,
  "stock": 100,
  "categoryId": 1,
  "image": "https://...",
  "images": ["https://...", "https://..."]
}
```

---

#### `PUT /products/:id` 🔒 Admin
Update any product field.

---

#### `DELETE /products/:id` 🔒 Admin
Soft-delete a product (sets `isActive = false`, preserves order history).

---

### Cart

> All cart endpoints require authentication 🔒

#### `GET /cart`
Get the current user's cart with all items, quantities, and totals.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "priceAtAdd": "1199.00",
        "product": { "id": 1, "name": "iPhone 15 Pro Max", ... }
      }
    ],
    "itemCount": 2,
    "totalAmount": 2398.00
  }
}
```

---

#### `POST /cart/items`
Add a product to the cart. If it already exists, quantity is increased.

**Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Errors:** `404` product not found | `400` insufficient stock

---

#### `PUT /cart/items/:itemId`
Update the quantity of a cart item.

**Body:**
```json
{
  "quantity": 5
}
```

**Errors:** `404` item not found | `400` insufficient stock

---

#### `DELETE /cart/items/:itemId`
Remove a specific item from the cart.

---

#### `DELETE /cart`
Clear all items from the cart.

---

### Wishlist

> All wishlist endpoints require authentication 🔒

#### `GET /wishlist`
Get the current user's wishlist with full product details.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "items": [
      {
        "id": 1,
        "product": { "id": 3, "name": "MacBook Pro 14\" M3", ... }
      }
    ]
  }
}
```

---

#### `POST /wishlist`
Add a product to the wishlist.

**Body:**
```json
{
  "productId": 3
}
```

**Errors:** `404` product not found | `409` already in wishlist

---

#### `DELETE /wishlist/:productId`
Remove a product from the wishlist by product ID.

---

#### `DELETE /wishlist`
Clear the entire wishlist.

---

### Orders

#### `POST /orders` 🔒
Create an order from the current cart contents.

- Validates stock availability for all items
- Decrements product stock atomically
- Clears the cart after successful order
- Preserves product name/price snapshots on order items

**Body:**
```json
{
  "shippingAddress": "456 User Lane, Sample City",
  "paymentMethod": "cash_on_delivery",
  "notes": "Ring twice"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": {
    "id": 1,
    "status": "pending",
    "totalAmount": "3946.00",
    "shippingAddress": "456 User Lane...",
    "paymentMethod": "cash_on_delivery",
    "items": [
      {
        "productName": "iPhone 15 Pro Max",
        "quantity": 3,
        "unitPrice": "1199.00",
        "subtotal": "3597.00"
      }
    ]
  }
}
```

**Errors:** `400` empty cart | `400` missing address | `400` insufficient stock

---

#### `GET /orders` 🔒
Get all orders for the logged-in user (newest first).

---

#### `GET /orders/:id` 🔒
Get a specific order detail. Users can only see their own orders; admins can see all.

**Errors:** `404` not found or not owned by user

---

#### `PATCH /orders/:id/status` 🔒 Admin
Update an order's status.

**Body:**
```json
{
  "status": "confirmed"
}
```

**Valid statuses:** `pending` → `confirmed` → `processing` → `shipped` → `delivered` | `cancelled`

---

#### `GET /orders/admin/all` 🔒 Admin
Get all orders across all users with pagination.

**Query:** `?page=1&limit=20&status=pending`

---

## ❌ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

| HTTP Code | Meaning |
|---|---|
| `400` | Bad Request — validation failed, empty cart, insufficient stock |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient permissions (not admin) |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — duplicate (e.g. email or wishlist item) |
| `500` | Internal Server Error |

---

## 🔐 Authentication

The API uses **JWT Bearer token** authentication.

1. Call `POST /auth/login` or `POST /auth/register`
2. Copy the `token` from the response
3. Send it in the `Authorization` header on protected routes:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Tokens expire after **7 days** (configurable via `JWT_EXPIRES_IN` in `.env`).

**Roles:**
- `user` — can manage their own cart, wishlist, and orders
- `admin` — can also create/edit/delete products & categories, update order status, view all orders

---

## 🧪 Running Tests

Use the included [`api-test.http`](./api-test.http) file with the **REST Client** extension in VS Code:

1. Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension
2. Open `api-test.http`
3. Login first → copy the token → paste into `@adminToken` / `@userToken` at the top
4. Click **Send Request** above any `###` block

All test cases are included: valid requests, auth errors, 404s, validation failures, etc.

---

## 🔄 Switching to MySQL / PostgreSQL

Only one file needs to change — `config/database.js`:

```js
// MySQL
const sequelize = new Sequelize('db_name', 'username', 'password', {
  dialect: 'mysql',
  host: 'localhost',
});

// PostgreSQL
const sequelize = new Sequelize('db_name', 'username', 'password', {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
});
```

Then install the matching driver:
```bash
npm install mysql2      # for MySQL
npm install pg pg-hstore # for PostgreSQL
```

---

## 📦 Available Scripts

```bash
npm start       # Start the server
npm run dev     # Start with nodemon (auto-restart on changes)
npm run seed    # Reset & reseed the database with sample data
```
