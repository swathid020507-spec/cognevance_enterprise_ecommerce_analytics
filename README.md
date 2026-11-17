# Enterprise E-Commerce & Analytics Platform

> **Cognevance Technologies** &bull; Level 3 Internship Project  
> A scalable, production-ready full-stack enterprise e-commerce platform integrated with real-time operational analytics, SKU management, order fulfillment workflows, and business intelligence.

---

## 📌 Project Overview

The **Enterprise E-Commerce & Analytics Platform** delivers end-to-end e-commerce capabilities tailored for enterprise procurement. It decouples the client-side presentation from backend business logic and database persistence:

- **Storefront:** Dynamic product catalog with real-time search, multi-category filtering, sort options, responsive product cards, and quick-view modals.
- **Cart & Procurement:** Real-time cart state with quantity stepper, subtotal, sales tax estimation, freight threshold calculations, and demo corporate checkout.
- **Order Fulfillment & Invoicing:** Generates unique enterprise order references (`COG-ORD-XXXX`), prints/downloads receipts, and persists order records.
- **Admin Control Plane & BI Analytics:** Executive dashboard with SKU inventory management (add, edit, delete), real-time revenue KPIs, average order value, order transaction tables, and category sales charts.
- **Backend Architecture:** REST API with Express.js, Mongoose schema modeling for MongoDB, and an intelligent in-memory failover repository that allows full platform functionality even before MongoDB is provisioned.

---

## 🌐 Live Deployment

The application is deployed and publicly accessible at the following verified endpoints:

- **Frontend Website:** [https://cognevance-ecommerce-frontend.onrender.com](https://cognevance-ecommerce-frontend.onrender.com)
- **Backend API:** [https://cognevance-ecommerce-backend.onrender.com](https://cognevance-ecommerce-backend.onrender.com)
- **Backend Health Check:** [https://cognevance-ecommerce-backend.onrender.com/api/health](https://cognevance-ecommerce-backend.onrender.com/api/health)

### Deployment Technologies

- **Frontend Hosting:** Render Static Site
- **Backend Hosting:** Render Web Service
- **Database:** MongoDB Atlas

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend UI** | React.js (v18+) | Component-driven architecture with React Hooks & Context API |
| **Frontend Tooling** | Vite (v6+) | Lightning-fast HMR and optimized production bundling |
| **Frontend Styling** | Modern CSS | Responsive CSS Grid, Flexbox, custom properties, and smooth animations |
| **Backend Runtime** | Node.js (v20+) | Asynchronous, event-driven server runtime |
| **Backend Framework** | Express.js (v4+) | Modular RESTful architecture with CORS & JSON body parsing |
| **Database & ODM** | MongoDB & Mongoose (v8+) | Enterprise document schema modeling with auto-seeding & in-memory fallback |
| **Configuration** | Dotenv | Environment variable isolation (`PORT`, `MONGODB_URI`, `VITE_API_BASE_URL`) |

---

## 📂 Project Folder Structure

```text
Cognevance_Enterprise_Ecommerce_Analytics/
├── .gitignore                          # Root Git ignore rules (node_modules, .env, build outputs)
├── README.md                           # Comprehensive project documentation
│
├── backend/                            # Node.js + Express + Mongoose Backend
│   ├── .env.example                    # Environment variable template
│   ├── .gitignore                      # Backend-specific ignore rules
│   ├── package.json                    # Backend dependencies & scripts
│   └── src/
│       ├── app.js                      # Express configuration, CORS, routes & middlewares
│       ├── server.js                   # Server entry point & DB connection trigger
│       ├── config/
│       │   └── db.js                   # Mongoose connection with auto-seeding & fallback
│       ├── controllers/
│       │   ├── authController.js       # Authentication & demo role switching
│       │   ├── healthController.js     # Health diagnostics at /api/health
│       │   ├── orderController.js      # Order creation, listing & KPI statistics
│       │   └── productController.js    # Catalog CRUD, search, categories & filtering
│       ├── data/
│       │   └── sampleProducts.js       # Curated enterprise seed products
│       ├── middlewares/
│       │   └── errorHandler.js         # Centralized error handler & 404 middleware
│       ├── models/
│       │   ├── Order.js                # Mongoose schema for customer orders
│       │   ├── Product.js              # Mongoose schema for enterprise SKUs
│       │   └── User.js                 # Mongoose schema for customer & admin users
│       └── routes/
│           ├── authRoutes.js           # Auth routes (/api/auth)
│           ├── healthRoutes.js         # Health routes (/api/health)
│           ├── orderRoutes.js          # Order routes (/api/orders)
│           └── productRoutes.js        # Product routes (/api/products)
│
└── frontend/                           # React + Vite Frontend
    ├── .env.example                    # Environment variable template
    ├── .gitignore                      # Frontend-specific ignore rules
    ├── index.html                      # HTML entry document
    ├── package.json                    # Frontend dependencies & scripts
    ├── vite.config.js                  # Vite React configuration
    └── src/
        ├── App.css                     # Storefront & layout styling
        ├── App.jsx                     # Top-level application layout & view router
        ├── index.css                   # Global design tokens, typography & CSS resets
        ├── main.jsx                    # React DOM root entry point
        ├── components/
        │   ├── AdminDashboard.css      # Admin dashboard & analytics styling
        │   ├── AdminDashboard.jsx      # SKU management, KPI metrics & sales charts
        │   ├── AuthModal.css           # Auth dialog styling
        │   ├── AuthModal.jsx           # Sign in, registration & 1-click demo logins
        │   ├── CartDrawer.css          # Cart slide-over styling
        │   ├── CartDrawer.jsx          # Cart breakdown, quantity controls & freight calc
        │   ├── CategoryFilter.css      # Category filter toolbar styling
        │   ├── CategoryFilter.jsx      # Filter chips, sort selector & search clear
        │   ├── CheckoutModal.css       # Checkout modal styling
        │   ├── CheckoutModal.jsx       # Shipping form & demo payment selector
        │   ├── Footer.css              # Footer styling
        │   ├── Footer.jsx              # Project metadata & copyright
        │   ├── HealthCheckCard.css     # Health card styling
        │   ├── HealthCheckCard.jsx     # Live backend & DB connection diagnostics
        │   ├── HeroBanner.css          # Hero banner styling
        │   ├── HeroBanner.jsx          # Enterprise banner with procurement perks
        │   ├── Navbar.css              # Navigation styling
        │   ├── Navbar.jsx              # Responsive header, search bar, cart badge & auth pill
        │   ├── OrderConfirmationModal.css
        │   ├── OrderConfirmationModal.jsx # Order receipt, printable invoice & confirmation
        │   ├── ProductCard.css         # Product card styling
        │   ├── ProductCard.jsx         # Card with rating, price, stock & add-to-cart
        │   ├── ProductModal.css        # Quick-view modal styling
        │   ├── ProductModal.jsx        # Full product specifications & quantity selector
        │   ├── Toast.css               # Toast notification styling
        │   └── Toast.jsx               # Interactive feedback alerts
        ├── context/
        │   ├── AuthContext.jsx         # Global auth state & demo role switching
        │   └── CartContext.jsx         # Global cart state & price computations
        └── services/
            └── api.js                  # Backend API client with offline fallback
```

---

## 🚀 Step-by-Step Execution Guide

### 1. Start the Backend API (Port 5000)

Open **Terminal 1**:

```bash
# Navigate to the backend directory
cd backend

# Create your local environment file (if not already created)
cp .env.example .env
# PowerShell on Windows: Copy-Item .env.example .env

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev
```

- **Backend Base URL:** `http://localhost:5000`
- **Health Check API:** `http://localhost:5000/api/health`
- **Products API:** `http://localhost:5000/api/products`
- **Order Analytics API:** `http://localhost:5000/api/orders/analytics/stats`

---

### 2. Start the Frontend Application (Port 5173)

Open **Terminal 2**:

```bash
# Navigate to the frontend directory
cd frontend

# Create your local environment file (if not already created)
cp .env.example .env
# PowerShell on Windows: Copy-Item .env.example .env

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev
```

- **Frontend Application URL:** `http://localhost:5173`

---

## ⚡ Interactive Features & Testing Walkthrough

1. **Browse & Search:**
   - Use the sticky navigation bar or category chips to filter products by *Servers & Cloud*, *Workstations*, *Peripherals*, *Enterprise Software*, etc.
   - Test instant search by typing in terms like `"server"`, `"display"`, or `"firewall"`.
   - Sort by *Price: Low to High*, *Price: High to Low*, or *Rating*.
2. **Add to Cart & Quantity Steppers:**
   - Click **+ Add to Cart** on any card or open **Quick View** to choose custom quantities.
   - Open the **Cart** drawer to adjust quantities, review subtotal, freight ($0 if over $100), and estimated tax.
3. **Demo Checkout & Invoicing:**
   - Click **Proceed to Checkout**, review customer/shipping details, select *Demo Corporate Card* or *Corporate Purchase Order (Net-30)*, and click **Place Demo Order**.
   - An **Order Confirmation Modal** appears with a unique Order Number (`COG-ORD-XXXX`) and an option to **Print / Save Receipt**.
4. **Admin Dashboard & BI Analytics:**
   - Click **Admin & Analytics** in the top navigation.
   - Review live financial KPIs: *Total Gross Sales*, *Total Orders*, *Active SKUs*, and *Average Order Value*.
   - **Product Management:** Click **+ Add New SKU / Product** to catalogue items, or **Edit** / **Delete** existing SKUs.
   - **Order Transactions:** View the real-time list of customer orders with fulfillment status.
   - **Sales Analytics:** Visual category revenue distribution bars.
5. **Role Switching:**
   - Click on the user pill in the top right to switch between **Executive Admin** and **Procurement Client** with 1 click.
6. **Backend Health Diagnostics:**
   - Click **API Health** in the navbar to test live API communication with the Express backend and inspect the MongoDB connection state.

---

&copy; 2026 Cognevance Technologies. All rights reserved.
