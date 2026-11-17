const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderStats
} = require('../controllers/orderController');

// /api/orders
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/analytics/stats', getOrderStats);

module.exports = router;
