const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware setup
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permissive during development so localhost:5173, tools, or custom ports work seamlessly
      callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Cognevance Enterprise E-Commerce & Analytics Platform API',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      categories: '/api/products/categories',
      orders: '/api/orders',
      orderStats: '/api/orders/analytics/stats',
      auth: '/api/auth'
    },
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
