# 🛒 E-Commerce Backend API

A production-style **RESTful API** for an e-commerce platform, built with **Node.js, Express, MongoDB (Mongoose) and JWT authentication**. Designed as a portfolio-ready backend that pairs with any React/Vite frontend (MERN stack).

## ✨ Features

- **Authentication & Authorization** — JWT-based auth, password hashing with bcrypt, role-based access control (user/admin)
- **Product Management** — Full CRUD, text search, category/price/brand/rating filters, sorting, pagination
- **Categories** — CRUD for organizing products, auto-generated slugs
- **Shopping Cart** — Add/update/remove items, persistent per-user cart
- **Order & Checkout** — Place orders from cart, automatic stock deduction, order status tracking, payment status
- **Product Reviews & Ratings** — Authenticated users can review products; average rating auto-calculated
- **Admin Dashboard APIs** — Manage users, products, categories and orders
- **Centralized Error Handling** — Clean, consistent JSON error responses
- **Input Validation** — Request validation using `express-validator`
- **Database Seeder** — One command to populate sample categories/products/users for demos

## 🛠️ Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Runtime        | Node.js                              |
| Framework      | Express.js                           |
| Database       | MongoDB + Mongoose                   |
| Auth           | JSON Web Token (JWT) + bcrypt.js     |
| Validation     | express-validator                    |
| Dev Tools      | nodemon, morgan, dotenv              |

## 📁 Project Structure

```
ecommerce-backend/
├── config/
│   └── db.js                # MongoDB connection
├── controllers/              # Business logic
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── userController.js
├── middleware/
│   ├── auth.js               # protect & admin middleware
│   ├── errorHandler.js       # 404 + centralized error handler
│   └── validate.js           # express-validator result handler
├── models/                   # Mongoose schemas
│   ├── User.js
│   ├── Category.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
├── routes/                   # API route definitions
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── seed/
│   └── seeder.js             # Sample data importer
├── utils/
│   └── generateToken.js
├── .env.example
├── server.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local installation or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# then edit .env with your MongoDB URI and JWT secret

# 3. (Optional) Seed sample data
npm run seed

# 4. Run the development server
npm run dev
```

The API will be available at `http://localhost:5000`.

### Seeded demo accounts
| Role     | Email                 | Password    |
|----------|------------------------|-------------|
| Admin    | admin@example.com      | admin123    |
| Customer | customer@example.com   | customer123 |

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint     | Access  | Description              |
|--------|--------------|---------|---------------------------|
| POST   | `/register`  | Public  | Register a new user       |
| POST   | `/login`     | Public  | Login & get JWT token     |
| GET    | `/me`        | Private | Get current user profile  |
| PUT    | `/me`        | Private | Update current user       |

### Products — `/api/products`
| Method | Endpoint            | Access       | Description                                  |
|--------|----------------------|--------------|-----------------------------------------------|
| GET    | `/`                  | Public       | List products (search/filter/sort/paginate)   |
| GET    | `/featured`          | Public       | Get featured products                         |
| GET    | `/:id`               | Public       | Get single product                            |
| POST   | `/`                  | Admin        | Create product                                |
| PUT    | `/:id`                | Admin        | Update product                                |
| DELETE | `/:id`                | Admin        | Delete product                                |
| POST   | `/:id/reviews`        | Private      | Add a review to a product                     |

**Query params for `GET /api/products`:** `keyword`, `category`, `minPrice`, `maxPrice`, `brand`, `rating`, `sort` (`newest`/`priceAsc`/`priceDesc`/`rating`), `page`, `limit`

### Categories — `/api/categories`
| Method | Endpoint | Access | Description       |
|--------|----------|--------|---------------------|
| GET    | `/`      | Public | List all categories |
| GET    | `/:id`   | Public | Get one category    |
| POST   | `/`      | Admin  | Create category      |
| PUT    | `/:id`   | Admin  | Update category      |
| DELETE | `/:id`   | Admin  | Delete category      |

### Cart — `/api/cart` *(all routes private)*
| Method | Endpoint       | Description                |
|--------|----------------|------------------------------|
| GET    | `/`            | Get current user's cart     |
| POST   | `/`            | Add item to cart             |
| PUT    | `/:productId`  | Update item quantity         |
| DELETE | `/:productId`  | Remove item from cart        |
| DELETE | `/`            | Clear entire cart             |

### Orders — `/api/orders` *(all routes private)*
| Method | Endpoint         | Access  | Description                       |
|--------|-------------------|---------|-------------------------------------|
| POST   | `/`               | Private | Checkout — create order from cart   |
| GET    | `/myorders`        | Private | Get logged-in user's orders         |
| GET    | `/:id`             | Private | Get single order (owner/admin)      |
| PUT    | `/:id/pay`          | Private | Mark order as paid                  |
| GET    | `/`                | Admin   | Get all orders                      |
| PUT    | `/:id/deliver`      | Admin   | Mark order as delivered             |
| PUT    | `/:id/status`       | Admin   | Update order status                 |

### Users — `/api/users` *(all routes admin-only)*
| Method | Endpoint | Description       |
|--------|----------|----------------------|
| GET    | `/`      | List all users       |
| GET    | `/:id`   | Get single user      |
| PUT    | `/:id`   | Update role/status   |
| DELETE | `/:id`   | Delete a user         |

## 🔐 Authentication

Protected routes require a JWT in the `Authorization` header:

```
Authorization: Bearer <your_token_here>
```

The token is returned from `/api/auth/register` and `/api/auth/login`.

## 📦 Example Request

**Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Riaz Islam","email":"riaz@example.com","password":"123456"}'
```

**Create a product (admin)**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"name":"Gaming Mouse","description":"RGB gaming mouse","price":1500,"category":"<categoryId>","stock":20}'
```

## 🌱 Future Improvements
- Payment gateway integration (Stripe / SSLCommerz / bKash)
- Image upload via Cloudinary or AWS S3
- Order email notifications (Nodemailer)
- Wishlist feature
- Rate limiting & request logging for production
- Unit/integration tests with Jest & Supertest

## 👤 Author
**Riaz Islam** — Full Stack Developer (MERN)

## 📄 License
This project is licensed under the MIT License.
