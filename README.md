# RESTful Inventory Management System (IMS) Backend

A secure, real-time RESTful Inventory Management System API built with Node.js, Express, MongoDB, Mongoose, and JWT Authentication.

---

## 🚀 Features

### 1. Authentication & Session Management
- **Secure Registration & Login**: Password hashing using `bcrypt`.
- **JWT Authentication**: High-security token issuance using two separate tokens:
  - Short-lived **Access Token** (stored in HTTP-Only cookie).
  - Rotatable **Refresh Token** (stored in HTTP-Only cookie).
- **Token Renewal (Refresh Token Rotation)**: Rotation mechanism that renews the access token and issues a fresh refresh token automatically, invalidating the old refresh token to prevent replay attacks.
- **Role-based Authentication & Profile Fetching**.

### 2. Category Management
- CRUD operations for product categories.
- Combined category detail endpoint returning the category meta plus a **paginated product sub-list** belonging to that category.

### 3. Product Catalog
- Complete CRUD operations.
- **Search & Filtering**: Search products by name/SKU, and filter by category or stock status.
- **Sorting**: Sort products by name, quantity, or unit price.
- **Pagination**: Paginated product listings using a reusable query pagination engine.
- **Stock Automation**: Pre-save model hooks that automatically compute status (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`) based on quantity boundaries.

### 4. Inventory Transactions
- **Stock Adjustments**: Increase or decrease stock quantity on demand.
- **Audit Trails**: Record transactions documenting `previousQuantity`, `newQuantity`, and the administrator who performed the action.
- **Stock Validation**: Rejects decrease transactions if requested quantities exceed available stock levels.
- **Historical Logs**: Paginated listing of transaction logs globally or filtered by individual product.

### 5. Live Dashboard (SSE)
- **Live Stats Streaming**: Exposes a Server-Sent Events (SSE) connection pushing real-time metrics to client-side dashboards.
- **Aggregates Included**: Total Products, Total Categories, Total Stock Quantity (using MongoDB aggregation), Low Stock Items count, and Out of Stock Items count.
- **Event-Driven Architecture**: Uses a shared Node.js `EventEmitter` to push updates *immediately* upon database changes, avoiding unnecessary database polling.

### 6. Common Options Selector
- Dynamic options selector API (`GET /options?fields=categories,statuses,products`). Only executes database queries and returns metadata objects (formatted as `{ value, label }`) for the options explicitly requested by the client.

### 7. Security Best Practices
- **Helmet**: Adds secure HTTP response headers.
- **CORS**: Configured secure cross-origin resource sharing.
- **Rate Limiting**: Protects endpoints against brute-force attacks.
- **Sanitization & XSS Protection**: Injects middleware to sanitize user inputs, preventing SQL/NoSQL Injection and XSS attacks.

---

## 🛠 Tech Stack

- **Runtime Environment:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB
- **ORM:** Mongoose
- **Request Validation:** Zod
- **Security Middlewares:** Helmet, Cors, Express-Rate-Limit, Express-Mongo-Sanitize, XSS

---

## 📁 Project Structure

```text
src/
├── config/        # Database and CORS configurations
├── controllers/   # Route controller handlers
├── middlewares/   # Authentication, validation, and security middlewares
├── models/        # Mongoose schema definitions
├── routes/        # Express route paths
├── services/      # Business & database logic services
├── utils/         # Helper functions (ApiError, JWT tokens, cookie managers)
├── validators/    # Zod request body schemas
└── server.js      # Application starting entry point
```

---

## ⚙️ Step-by-Step Setup Guide

Follow these steps to run the backend application locally:

### Prerequisites
- Install **Node.js** (v18 or higher is recommended)
- A running **MongoDB** database instance (either MongoDB Local Community Server or a MongoDB Atlas cloud cluster URI)

### 1. Clone & Navigate to Repository
```bash
git clone <repository-url>
cd ims-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env` in the root directory:
```bash
cp .env.example .env
```
Open `.env` and fill in your configuration:
```env
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/ims_database   # Replace with your Atlas link if using cloud

# JSON Web Tokens Secrets
JWT_ACTION_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key

# Token Expiration Settings
JWT_ACTION_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cryptography Settings
BCRYPT_SALT_ROUNDS=12

# Frontend URL Allowed to communicate with this Backend
CLIENT_URL=http://localhost:5173
```

### 4. Create the Initial Admin User
If you are setting up the system for the first time, you will need an Admin account to manage resources. Run the interactive CLI script:
```bash
npm run create-admin
```
Follow the prompts to enter the Admin Name, Email, and Password. The script will securely hash the password and register the account in your MongoDB database.

### 5. Run the Dev Server
To start the backend using `nodemon` (auto-reloads on file edits):
```bash
npm run dev
```

The server should start and display:
```text
MongoDB Connected
Server running on port 3000
```

### 5. API Testing
You can import the endpoints into your API client (like Postman or Insomnia). The base endpoint is:
`http://localhost:3000/api/v1`

---

## 📡 API Route Directory

### Authentication Routes (`/auth`)
- `POST /auth/register` - Create user account
- `POST /auth/login` - Authenticate user & receive cookies
- `POST /auth/refresh` - Rotate access/refresh tokens
- `POST /auth/logout` - Clear session cookies
- `GET /auth/me` - Fetch authenticated user details

### Category Routes (`/categories`)
- `POST /categories` - Create new category *(Admin only)*
- `GET /categories` - List categories
- `GET /categories/:id` - Fetch category details with paginated sub-products
- `PATCH /categories/:id` - Update category *(Admin only)*
- `DELETE /categories/:id` - Remove category *(Admin only)*

### Product Routes (`/products`)
- `POST /products` - Create product *(Authenticated users)*
- `GET /products` - Search, filter, and paginate products *(Authenticated users)*
- `GET /products/:id` - Get product profile *(Authenticated users)*
- `PATCH /products/:id` - Edit product details *(Authenticated users)*
- `DELETE /products/:id` - Remove product *(Admin only)*

### Inventory Routes (`/inventory`)
- `POST /inventory` - Adjust product stock levels *(Authenticated users)*
- `GET /inventory` - List stock transactions history *(Authenticated users)*
- `GET /inventory/product/:productId` - Get transaction logs for specific product *(Authenticated users)*

### Dashboard Routes (`/dashboard`)
- `GET /dashboard/stats/stream` - Persistent SSE stream pushing live stats *(Authenticated users)*

### Options Selector Routes (`/options`)
- `GET /options?fields=categories,statuses,products` - Fetch dropdown options *(Authenticated users)*
