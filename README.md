# 🛍️ ShopNest — MERN E-Commerce App

A full-stack e-commerce application built with MongoDB, Express.js, React, and Node.js.

**Live Demo:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-api.onrender.com`

**Admin Credentials:**
- Email: `admin@shopnest.com`
- Password: `Admin@123`

---

## ✨ Features

- **Product Listing** — Grid view with real-time search and filters (category, price range, sort)
- **Shopping Cart** — Add/remove items, update quantity, cart total, persisted in localStorage
- **Admin Panel** — Protected CRUD for products, analytics dashboard with category stats
- **Auth System** — JWT-based login/register, role-based access (admin/user)
- **Responsive** — Mobile-first, works across all screen sizes

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router 6, Axios, react-hot-toast |
| Backend | Node.js, Express.js, JWT, bcryptjs |
| Database | MongoDB Atlas, Mongoose |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── models/
│   │   ├── Product.js      # Mongoose product schema
│   │   └── User.js         # Mongoose user schema + bcrypt
│   ├── routes/
│   │   ├── auth.js         # Login, register, /me
│   │   ├── products.js     # Public product listing + search
│   │   └── admin.js        # Protected CRUD + stats
│   ├── middleware/
│   │   └── auth.js         # JWT protect + adminOnly middleware
│   ├── server.js           # Express app + MongoDB connect
│   ├── seed.js             # Database seeder (16 products + users)
│   ├── render.yaml         # Render deployment config
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js   # Sticky nav with cart badge
    │   │   └── ProductCard.js
    │   ├── context/
    │   │   ├── AuthContext.js  # Login state, JWT storage
    │   │   └── CartContext.js  # Cart state + localStorage sync
    │   ├── pages/
    │   │   ├── HomePage.js     # Hero + categories + featured
    │   │   ├── ProductsPage.js # Search, filter, paginate
    │   │   ├── ProductDetailPage.js
    │   │   ├── CartPage.js
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   └── AdminPage.js    # Full CRUD + analytics
    │   ├── utils/
    │   │   └── api.js          # Axios instance + all API calls
    │   └── App.js
    └── vercel.json
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/shopnest.git
cd shopnest
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/shopnest
JWT_SECRET=any_long_random_string_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Seed the database:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start React:
```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🌐 Deployment

### Deploy Backend to Render

1. Push backend folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect repo, set root directory to `backend/`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random string
   - `FRONTEND_URL` — your Vercel URL (after deploying frontend)
7. Deploy → copy the URL (e.g. `https://shopnest-api.onrender.com`)

### Deploy Frontend to Vercel

1. Push frontend folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repo, set root directory to `frontend/`
4. Add environment variable:
   - `REACT_APP_API_URL` = `https://shopnest-api.onrender.com/api`
5. Deploy → copy the URL
6. Go back to Render → update `FRONTEND_URL` with Vercel URL

---

## 📡 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (search, filter, paginate) |
| GET | `/api/products/:id` | Single product |
| GET | `/api/products/categories` | All categories |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user (auth required) |

### Admin (requires Bearer token + admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/products` | List all products |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| GET | `/api/admin/stats` | Dashboard analytics |

---

## 🔐 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopnest.com | Admin@123 |
| User | user@shopnest.com | User@123 |

---

## 💡 Most Interesting Feature

The most interesting feature was building the **real-time search + multi-filter system** that debounces user input (400ms), then fires a single optimised MongoDB query combining `$regex` text search, category matching, and price range filters — all server-side — then updates the product grid without any page reload. Combined with the localStorage-synced cart context, the entire experience feels native and fast even across page navigations.

---

## 📝 License

MIT
