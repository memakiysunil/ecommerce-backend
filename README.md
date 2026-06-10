# 🛒 E-Commerce Backend API

A RESTful backend API for an e-commerce platform built with **Node.js**, **Express.js**, and **MongoDB**. It supports user authentication, product management, cart operations, and order processing with Razorpay payment integration.

---

## 🚀 Live Demo

> **Deployed URL:** `https://your-deployed-url.com`  
> *(Update this after deploying on Render / Railway / etc.)*

**Base URL:** `https://your-deployed-url.com`

Test the API root:
```
GET https://your-deployed-url.com/
```
Response:
```json
{
  "success": true,
  "message": "E-commerce Backend API Running 🚀"
}
```

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
| Razorpay | Payment gateway |
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

## 🏗️ MVC Architecture

This project follows the **MVC (Model - View - Controller)** pattern. Since this is a backend-only API (no frontend/views), it uses a **Model - Controller** structure with **Routes** acting as the entry point.

```
HTTP Request
     │
     ▼
┌─────────────┐
│   Routes    │  ← Receives the request, applies middleware, calls controller
│ (routes/)   │    e.g. router.post('/login', validate, controller.login)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Middleware  │  ← Runs before controller: Auth check, Rate limit, Validation
│(middleware/)│    e.g. jwtAuthMiddleware, validateRequest, checkAdminRole
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │  ← Business logic: what should happen for this request
│(controllers)│    e.g. hash password, save user, return response
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Model    │  ← Talks to MongoDB using Mongoose schema
│  (models/)  │    e.g. User.create(), Product.find()
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MongoDB   │  ← Actual database (hosted on MongoDB Atlas)
└─────────────┘
```

### 📌 Each Layer Explained

**Model (`models/`)** — Defines the database schema (shape of data)
```js
// models/User.js
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' }
});
```

**Controller (`controllers/`)** — Contains the actual logic for each API
```js
// controllers/userController.js
const signup = async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });
  res.status(201).json({ success: true, user });
};
```

**Route (`routes/`)** — Maps URL + HTTP method to the right controller function
```js
// routes/userRoutes.js
router.post('/signup', validateRequest(signup), userController.signup);
router.post('/login',  strictLimiter, userController.login);
```

**Middleware (`middleware/`)** — Reusable logic that runs between Route → Controller
```js
// middleware/authMiddleware.js
// Checks if JWT token is valid before allowing access
const jwtAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

**Validator (`validators/`)** — Joi schemas that validate request body shape
```js
// validators/userValidator.js — runs BEFORE controller
const signup = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
```

---

## 🧩 Service Layer (Why & How)

This project currently uses a **Route → Middleware → Controller → Model** flow.

For scalability, a **Service Layer** can be added between Controller and Model. Here's how the full architecture looks with it:

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
│ (services/) │    DB queries, calculations, transformations
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

### 📌 Example — Without vs With Service Layer

**❌ Without Service (fat controller — hard to maintain):**
```js
// controllers/userController.js
const signup = async (req, res, next) => {
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashed });

    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
```

**✅ With Service (clean & reusable):**
```js
// services/userService.js — only business logic
const createUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw new Error('Email already exists');

  const hashed = await bcrypt.hash(data.password, 10);
  return await User.create({ ...data, password: hashed });
};

module.exports = { createUser };
```

```js
// controllers/userController.js — only req/res
const userService = require('../services/userService');

const signup = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
```

### 📌 Folder Structure with Service Layer

```
ecommerce-backend/
│
├── controllers/         ← req/res only
│   └── userController.js
│
├── services/            ← business logic (add this folder)
│   ├── userService.js
│   ├── productService.js
│   ├── cartService.js
│   └── orderService.js
│
├── models/              ← DB schema only
│   └── User.js
│
└── routes/              ← URL mapping only
    └── userRoutes.js
```

> 💡 **When to add Service Layer?** When your controller functions start growing beyond 20–30 lines, or when you need the same logic in multiple controllers — that's the right time to extract a service.

---

## ⚙️ Local Setup

Follow these steps to run the project on your machine:

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

Create a `.env` file in the root of the project and add:

```env
PORT=7000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> ⚠️ Never push your `.env` file to GitHub. It is already in `.gitignore`.

### 4. Start the Server

```bash
# Production
npm start

# Development (with auto-reload)
npx nodemon server.js
```

Server will run at: `http://localhost:7000`

---

## 🔗 API Endpoints

All protected routes require this header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 👤 User Routes — `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/user/signup` | ❌ | Register new user |
| POST | `/user/login` | ❌ | Login and get JWT token |
| GET | `/user/profile` | ✅ | Get logged-in user profile |
| PATCH | `/user/profile/password` | ✅ | Update password |

---

### 📦 Product Routes — `/product`

> Admin role required for create/update/delete operations.

| Method | Endpoint | Auth | Admin | Description |
|---|---|---|---|---|
| POST | `/product/singleproduct` | ✅ | ✅ | Add one product |
| POST | `/product/createManyProducts` | ✅ | ✅ | Add multiple products |
| PUT | `/product/updateproduct/:productID` | ✅ | ✅ | Update a product |
| DELETE | `/product/deleteproduct/:productID` | ✅ | ✅ | Delete a product |
| GET | `/product/searchproducts` | ✅ | ❌ | Search products |

---

### 🛒 Cart Routes — `/cart`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/cart/addtocart/:productID` | ✅ | Add product to cart |
| PATCH | `/cart/updatecart/:productID` | ✅ | Update cart item quantity |
| DELETE | `/cart/deletecart/:productID` | ✅ | Remove product from cart |
| GET | `/cart/getcart` | ✅ | View user's cart |

---

### 🧾 Order Routes — `/order`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/order/orders/:productID` | ✅ | Place an order |
| GET | `/order/getorder` | ✅ | Get user's orders |

---

## 🔐 Security Features

- **JWT Authentication** — Token expires in 7 days
- **Password Hashing** — bcrypt used for secure password storage
- **Helmet** — Sets secure HTTP headers
- **Rate Limiting** — Global limiter on all routes; strict limiter on login & password change
- **Input Validation** — Joi validates all request bodies before hitting controllers
- **Admin Middleware** — Protects product management routes from regular users

---

## ☁️ Deployment Guide (Render)

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [https://render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Set the following:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add your environment variables in the **Environment** section on Render:
   - `MONGO_URL`
   - `JWT_SECRET`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
6. Click **Deploy** — your API will be live in a few minutes!

> 💡 Tip: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for your cloud database.

---

## 🌐 Environment Variables Reference

| Variable | Description |
|---|---|
| `PORT` | Port number (default: 7000) |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret key |

---

## 👨‍💻 Author

**Your Name**  
GitHub: [@your-username](https://github.com/your-username)  
LinkedIn: [your-linkedin](https://linkedin.com/in/your-profile)

---

## 📄 License

This project is licensed under the **ISC License**.
