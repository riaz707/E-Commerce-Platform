# E-Commerce Web Application

A full-stack e-commerce application built with the MERN stack — a Node.js/Express/MongoDB REST API on the backend and a React (Vite + Tailwind CSS) single-page app on the frontend.

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- JWT-based authentication
- bcryptjs for password hashing
- express-validator for input validation

**Frontend**
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios

## Project Structure

```
E-commerce/
├── backend/          # Express REST API
│   ├── config/        # Database connection config
│   ├── controllers/   # Route logic
│   ├── middleware/    # Auth & error handling middleware
│   ├── models/        # Mongoose schemas (User, Product, Category, Cart, Order)
│   ├── routes/         # API route definitions
│   ├── seed/           # Database seeding scripts
│   └── server.js        # App entry point
└── frontend/         # React client
    └── src/
        ├── api/         # Axios API client
        ├── components/  # Reusable UI components
        ├── context/     # Auth & Cart context providers
        └── pages/       # Route-level pages
```

## Features

- User registration & login with JWT authentication
- Product catalog with categories
- Shopping cart management
- Order placement and order history
- User profile management
- Admin dashboard for managing products/orders

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local instance or MongoDB Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your MongoDB URI & JWT secret
npm run dev             # starts the API with nodemon
```

The API runs on `http://localhost:5000` by default.

To seed the database with sample data:

```bash
npm run seed
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Environment Variables (Backend)

Create a `.env` file inside `backend/` based on `.env.example`:

| Variable      | Description                                  |
|---------------|-----------------------------------------------|
| `NODE_ENV`    | `development` or `production`                |
| `PORT`        | Port for the API server (default `5000`)      |
| `MONGO_URI`   | MongoDB connection string                     |
| `JWT_SECRET`  | Secret key used to sign JWT tokens            |
| `JWT_EXPIRE`  | JWT expiration (e.g. `30d`)                   |
| `CLIENT_URL`  | Allowed CORS origin(s), comma-separated       |

## API Overview

| Route             | Description                  |
|--------------------|-------------------------------|
| `/api/auth`        | Register, login                |
| `/api/products`    | Product listing & details      |
| `/api/categories`  | Product categories             |
| `/api/cart`        | Cart operations                |
| `/api/orders`      | Order placement & history      |
| `/api/users`       | User profile management        |

## Author

**Riaz Islam**

## License

MIT
