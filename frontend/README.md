# ShopVibe — E-Commerce Frontend

React + Vite + Tailwind CSS frontend for the MERN e-commerce backend.

## Setup

```bash
npm install
npm run dev
```

Backend must be running on `http://localhost:5000`.

## Features

### Pages
- **Home** — Hero banner, featured products, feature highlights
- **Products** — Full listing with search, category filter, price range, sort, pagination
- **Product Detail** — Images, add to cart with quantity, star reviews
- **Login / Register** — JWT auth with form validation
- **Cart Drawer** — Slide-in cart with quantity controls
- **Checkout** — Shipping address + payment method (COD, bKash, Nagad, Card)
- **Orders** — Order history and detail view
- **Profile** — Update name, phone, address, password
- **Admin Dashboard** — Manage products (CRUD) + update order statuses

### API Coverage
| Endpoint | Used In |
|---|---|
| `POST /api/auth/register` | Register page |
| `POST /api/auth/login` | Login page |
| `GET /api/auth/me` | Auth context |
| `PUT /api/auth/me` | Profile page |
| `GET /api/products` | Products page (with filters) |
| `GET /api/products/featured` | Home page |
| `GET /api/products/:id` | Product detail |
| `POST /api/products` | Admin (create) |
| `PUT /api/products/:id` | Admin (edit) |
| `DELETE /api/products/:id` | Admin (delete) |
| `POST /api/products/:id/reviews` | Product detail |
| `GET /api/categories` | Filters sidebar + Admin |
| `GET /api/cart` | Cart drawer |
| `POST /api/cart` | Add to cart |
| `PUT /api/cart/:productId` | Update qty |
| `DELETE /api/cart/:productId` | Remove item |
| `DELETE /api/cart` | Clear cart |
| `POST /api/orders` | Checkout |
| `GET /api/orders/myorders` | Orders page |
| `GET /api/orders/:id` | Order detail |
| `GET /api/orders` | Admin orders tab |
| `PUT /api/orders/:id/status` | Admin status update |

## Tech Stack
- React 18 + React Router v6
- Tailwind CSS (custom navy + orange theme)
- Axios with JWT interceptor
- Context API (Auth + Cart)
