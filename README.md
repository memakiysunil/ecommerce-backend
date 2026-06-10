# 🛒 E-Commerce Backend API

A RESTful backend API for an e-commerce platform built with **Node.js**, **Express.js**, and **MongoDB**. It supports user authentication, product management, cart operations, and order processing.

---

## 🌐 Live Demo

**Base URL:** https://ecommerce-backend-52ui.onrender.com

> ⚠️ Note: Free tier server sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up the server.

**Test Endpoints:**
```
GET   https://ecommerce-backend-52ui.onrender.com/
POST  https://ecommerce-backend-52ui.onrender.com/user/signup
POST  https://ecommerce-backend-52ui.onrender.com/user/login
GET   https://ecommerce-backend-52ui.onrender.com/product/searchproducts
```

---

## ✨ Features

- User Registration & Login
- JWT Authentication & Authorization
- Role-Based Access Control (Admin/User)
- Product Management (CRUD)
- Shopping Cart Management
- Order Management
- Password Hashing using bcrypt
- Request Validation using Joi
- Global Error Handling
- Rate Limiting
- Helmet Security Headers
- MongoDB Atlas Integration
- RESTful API Design
- MVC Architecture

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js v5 | Web framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| Joi | Request validation |
| Helmet | Security headers |
| Morgan | HTTP request logging |
| express-rate-limit | Rate limiting |
| dotenv | Environment variables |

---

## 📁 Project Structure

```
ecommerce-backend/
│
├── app.js                  # Express app setup (middlewares, routes)
├── server.js               # Entry point — starts the server
│
├── config/
│   └── db.js               # MongoDB connection setup
│
├── controllers/            # Business logic for each route
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   └── orderController.js
│
├── middleware/             # Custom middleware
│   ├── authMiddleware.js       # JWT verification + token generation
│   ├── adminMiddleware.js      # Admin role check
│   ├── errorMiddleware.js      # Global error handler
│   ├── rateLimiterMiddleware.js # Rate limiting (global + strict)
│   └── validateMiddleware.js   # Joi request validation wrapper
│
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
│
├── routes/                 # Route definitions
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
│
├── validators/             # Joi validation schemas
│   ├── userValidator.js
│   ├── productValidator.js
│   ├── cartValidator.js
│   └── oderValidator.js
│
├── .env                    # Environment variables (never commit this!)
├── .gitignore
└── package.json
```

---

## 🚀 API Endpoints

> Protected routes require: `Authorization: Bearer <your_jwt_token>`

### 👤 Authentication

```
POST   /user/signup              → Register new user
POST   /user/login               → Login & get JWT token
GET    /user/profile             → Get logged-in user profile (Auth)
PATCH  /user/profile/password    → Update password (Auth)
```

---

### 📦 Products

```
POST    /product/singleproduct              → Add one product (Admin only)
POST    /product/createManyProducts         → Add multiple products (Admin only)
PUT     /product/updateproduct/:productID   → Update a product (Admin only)
DELETE  /product/deleteproduct/:productID   → Delete a product (Admin only)
GET     /product/searchproducts             → Search products (Auth)
```

---

### 🛒 Cart

```
POST    /cart/addtocart/:productID    → Add product to cart (Auth)
PATCH   /cart/updatecart/:productID   → Update cart item quantity (Auth)
DELETE  /cart/deletecart/:productID   → Remove product from cart (Auth)
GET     /cart/getcart                 → Get user's cart (Auth)
```

---

### 🧾 Orders

```
POST   /order/orders/:productID   → Place an order (Auth)
GET    /order/getorder            → Get user's orders (Auth)
```

---

## 🏗️ MVC Architecture

This project follows the **MVC (Model - View - Controller)** pattern. Since this is a backend-only API (no frontend/views), it uses a **Model - Controller** structure with **Routes** acting as the entry point.

```
HTTP Request
     │
     ▼
┌─────────────┐
│   Routes    │  ← Receives the request, applies middleware, calls controller
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │  ← Auth check, Rate limit, Validation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  ← Business logic: what should happen for this request
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Model    │  ← Talks to MongoDB using Mongoose schema
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MongoDB   │  ← Actual database (hosted on MongoDB Atlas)
└─────────────┘
```

### 📌 Each Layer Explained

**Model (`models/`)** — Defines the database schema (shape of data)
```
User    → name, email, password, role (user/admin)
Product → name, price, description, category, stock
Cart    → user, items[ { product, quantity } ]
Order   → user, product, quantity, address, status
```

**Controller (`controllers/`)** — Contains the actual logic for each API
```
userController    → signup, login, getProfile, updatePassword
productController → singleProduct, createMany, update, delete, search
cartController    → addToCart, updateCart, deleteCart, getCart
orderController   → placeOrder, getOrders
```

**Route (`routes/`)** — Maps URL + HTTP method to the right controller
```
/user     → userRoutes.js
/product  → productRoutes.js
/cart     → cartRoutes.js
/order    → orderRoutes.js
```

**Middleware (`middleware/`)** — Reusable logic that runs between Route → Controller
```
authMiddleware        → Verifies JWT token on protected routes
adminMiddleware       → Checks if user role is 'admin'
validateMiddleware    → Validates request body using Joi schemas
rateLimiterMiddleware → Global + strict rate limiting
errorMiddleware       → Global error handler
```

---

## 🧩 Service Layer (Why & How)

This project currently uses a **Route → Middleware → Controller → Model** flow.

For scalability, a **Service Layer** can be added between Controller and Model:

```
HTTP Request
     │
     ▼
┌─────────────┐
│   Routes    │  ← Entry point, maps URL to controller
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │  ← Auth, Rate Limit, Validation
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  ← Only handles req/res — calls service
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │  ← All business logic lives here
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Model    │  ← Mongoose schema, talks to MongoDB
└─────────────┘
```

### 📌 Controller vs Service — What Goes Where?

| Task | Controller | Service |
|---|---|---|
| Read `req.body` | ✅ | ❌ |
| Send `res.json()` | ✅ | ❌ |
| Hash password | ❌ | ✅ |
| Check if user exists | ❌ | ✅ |
| DB query (find/save) | ❌ | ✅ |
| Calculate order total | ❌ | ✅ |

> 💡 **When to add Service Layer?** When controller functions grow beyond 20-30 lines, or when the same logic is needed in multiple controllers.

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/memakiysunil/ecommerce-backend.git
cd ecommerce-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

```env
PORT=7000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

> ⚠️ Never push your `.env` file to GitHub. It is already in `.gitignore`.

### 4. Start the Server

```bash
# Development (with auto-reload)
npx nodemon server.js

# Production
npm start
```

Server will run at: `http://localhost:7000`

---

## 🔐 Security Features

- **JWT Authentication** — Token expires in 7 days
- **Password Hashing** — bcrypt used for secure password storage
- **Helmet** — Sets secure HTTP headers
- **Rate Limiting** — Global limiter on all routes; strict limiter on login & password change
- **Input Validation** — Joi validates all request bodies before hitting controllers
- **Admin Middleware** — Protects product management routes from regular users

---

## ☁️ Deployment

This project is deployed on **Render**.

- **Live URL:** https://ecommerce-backend-52ui.onrender.com
- **Database:** MongoDB Atlas
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

---

## 🌍 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port number (default: 7000) |
| `MONGO_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## 👨‍💻 Author

**Sunil Memakiya**

GitHub: https://github.com/memakiysunil

LinkedIn: https://www.linkedin.com/in/memakiya-sunil-a710683ba/

---

## 📄 License

This project is licensed under the **ISC License**.