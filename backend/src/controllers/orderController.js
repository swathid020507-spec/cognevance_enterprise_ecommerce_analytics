const Order = require('../models/Order');
const Product = require('../models/Product');
const { isDbConnected } = require('../config/db');

// Seed orders for immediate realistic dashboard metrics
let inMemoryOrders = [
  {
    _id: 'ord-1001',
    orderNumber: 'COG-ORD-8821',
    customer: {
      name: 'Sarah Jenkins',
      email: 's.jenkins@acmecorp.com',
      phone: '+1 415-555-0192'
    },
    shippingAddress: {
      address: '500 Howard Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA'
    },
    orderItems: [
      {
        product: 'prod-001',
        name: 'Enterprise Rack Server Pro X9',
        price: 2899.99,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
      },
      {
        product: 'prod-003',
        name: 'UltraWide 40" 5K Thunderbolt Display',
        price: 1199.50,
        qty: 2,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
      }
    ],
    paymentMethod: 'Demo Enterprise Card (**** 4242)',
    itemsPrice: 5298.99,
    taxPrice: 423.92,
    shippingPrice: 0.00,
    totalAmount: 5722.91,
    isPaid: true,
    paidAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString(),
    status: 'Shipped',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2).toISOString()
  },
  {
    _id: 'ord-1002',
    orderNumber: 'COG-ORD-8822',
    customer: {
      name: 'David Martinez',
      email: 'david.m@nexuscloud.io',
      phone: '+1 212-555-0143'
    },
    shippingAddress: {
      address: '110 Wall Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10005',
      country: 'USA'
    },
    orderItems: [
      {
        product: 'prod-004',
        name: 'Cognevance BI & Real-time Analytics Suite',
        price: 799.00,
        qty: 3,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      }
    ],
    paymentMethod: 'Corporate Purchase Order (PO-941)',
    itemsPrice: 2397.00,
    taxPrice: 191.76,
    shippingPrice: 0.00,
    totalAmount: 2588.76,
    isPaid: true,
    paidAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    status: 'Processing',
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
  },
  {
    _id: 'ord-1003',
    orderNumber: 'COG-ORD-8823',
    customer: {
      name: 'Elena Rostova',
      email: 'e.rostova@fintechglobal.net',
      phone: '+1 312-555-0188'
    },
    shippingAddress: {
      address: '233 S Wacker Dr',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60606',
      country: 'USA'
    },
    orderItems: [
      {
        product: 'prod-002',
        name: 'Quantum Core Workstation X1',
        price: 3499.00,
        qty: 1,
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80'
      },
      {
        product: 'prod-008',
        name: 'Tactile Wireless Mechanical Developer Deck',
        price: 219.00,
        qty: 2,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
      }
    ],
    paymentMethod: 'Demo Enterprise Card (**** 8899)',
    itemsPrice: 3937.00,
    taxPrice: 314.96,
    shippingPrice: 0.00,
    totalAmount: 4251.96,
    isPaid: true,
    paidAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    status: 'Processing',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
  }
];

/**
 * POST /api/orders
 * Create new customer order (Demo checkout)
 */
const createOrder = async (req, res, next) => {
  try {
    const {
      customer,
      shippingAddress,
      orderItems,
      paymentMethod = 'Demo Credit Card',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalAmount
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!customer?.name || !customer?.email) {
      return res.status(400).json({ success: false, message: 'Customer name and email are required' });
    }

    const orderNumber = `COG-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderData = {
      orderNumber,
      customer,
      shippingAddress: shippingAddress || {
        address: '100 Innovation Way',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'USA'
      },
      orderItems,
      paymentMethod,
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalAmount: Number(totalAmount) || 0,
      isPaid: true,
      paidAt: new Date().toISOString(),
      status: 'Processing',
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      const createdOrder = await Order.create(orderData);
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: createdOrder
      });
    }

    const memoryOrder = {
      _id: `ord-${Date.now()}`,
      ...orderData
    };
    inMemoryOrders.unshift(memoryOrder);

    return res.status(201).json({
      success: true,
      source: 'memory_fallback',
      message: 'Demo order placed successfully',
      data: memoryOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders
 * Fetch all orders (Admin)
 */
const getOrders = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, data: orders });
    }

    return res.json({
      success: true,
      count: inMemoryOrders.length,
      source: 'memory_fallback',
      data: inMemoryOrders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/orders/analytics/stats
 * Admin dashboard statistics: total sales, total orders, total products, average order value
 */
const getOrderStats = async (req, res, next) => {
  try {
    let ordersList = inMemoryOrders;
    let productsCount = 8;

    if (isDbConnected()) {
      const dbOrders = await Order.find();
      if (dbOrders && dbOrders.length > 0) {
        ordersList = dbOrders;
      }
      productsCount = await Product.countDocuments();
    }

    const totalOrders = ordersList.length;
    const totalSales = ordersList.reduce((acc, item) => acc + (item.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Category breakdown
    const categoryStats = {
      'Servers & Cloud': 2899.99,
      'Workstations': 3499.00,
      'Peripherals': 2837.00,
      'Enterprise Software': 2397.00,
      'Networking': 1550.00
    };

    return res.json({
      success: true,
      data: {
        totalSales: Number(totalSales.toFixed(2)),
        totalOrders,
        totalProducts: productsCount,
        averageOrderValue: Number(averageOrderValue.toFixed(2)),
        recentOrders: ordersList.slice(0, 5),
        categoryBreakdown: categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderStats
};
