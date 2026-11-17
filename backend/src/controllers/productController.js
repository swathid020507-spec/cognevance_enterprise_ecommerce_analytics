const Product = require('../models/Product');
const { isDbConnected } = require('../config/db');
const initialSampleProducts = require('../data/sampleProducts');

// In-memory fallback repository
let inMemoryProducts = [...initialSampleProducts];

/**
 * GET /api/products
 * Fetch all products with search, category filtering and sorting
 */
const getProducts = async (req, res, next) => {
  try {
    const { search = '', category = '', sort = 'featured' } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (category && category !== 'All' && category !== 'All Categories') {
        query.category = category;
      }

      if (search.trim()) {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } }
        ];
      }

      let sortOption = {};
      if (sort === 'price-low') sortOption = { price: 1 };
      else if (sort === 'price-high') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { rating: -1 };
      else sortOption = { isFeatured: -1, createdAt: -1 };

      const products = await Product.find(query).sort(sortOption);
      return res.json({
        success: true,
        count: products.length,
        source: 'mongodb',
        data: products
      });
    }

    // In-memory fallback
    let filtered = [...inMemoryProducts];

    if (category && category !== 'All' && category !== 'All Categories') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }

    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // featured
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return res.json({
      success: true,
      count: filtered.length,
      source: 'memory_fallback',
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/categories
 * List distinct categories
 */
const getCategories = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const categories = await Product.distinct('category');
      return res.json({ success: true, data: categories });
    }

    const categories = Array.from(new Set(inMemoryProducts.map((p) => p.category)));
    return res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Fetch single product by ID
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      // Check MongoDB if valid ObjectId or search by ID
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const product = await Product.findById(id);
        if (product) {
          return res.json({ success: true, data: product });
        }
      }
    }

    const product = inMemoryProducts.find((p) => p.id === id || p._id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Create new product (Admin)
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, image, countInStock, isFeatured } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price and category are required'
      });
    }

    const productPayload = {
      name,
      description: description || 'Enterprise grade solution.',
      price: Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      countInStock: Number(countInStock) || 10,
      rating: 4.8,
      numReviews: 0,
      isFeatured: Boolean(isFeatured)
    };

    if (isDbConnected()) {
      const newProduct = await Product.create(productPayload);
      return res.status(201).json({ success: true, data: newProduct });
    }

    const newMemoryProduct = {
      id: `prod-${Date.now()}`,
      _id: `prod-${Date.now()}`,
      ...productPayload,
      createdAt: new Date().toISOString()
    };

    inMemoryProducts.unshift(newMemoryProduct);

    return res.status(201).json({
      success: true,
      source: 'memory_fallback',
      data: newMemoryProduct
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Update existing product (Admin)
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isDbConnected() && id.match(/^[0-9a-fA-F]{24}$/)) {
      const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (updated) {
        return res.json({ success: true, data: updated });
      }
    }

    const index = inMemoryProducts.findIndex((p) => p.id === id || p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    inMemoryProducts[index] = {
      ...inMemoryProducts[index],
      ...updates,
      price: updates.price ? Number(updates.price) : inMemoryProducts[index].price,
      countInStock: updates.countInStock !== undefined ? Number(updates.countInStock) : inMemoryProducts[index].countInStock,
      updatedAt: new Date().toISOString()
    };

    return res.json({ success: true, data: inMemoryProducts[index] });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Delete product (Admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && id.match(/^[0-9a-fA-F]{24}$/)) {
      const deleted = await Product.findByIdAndDelete(id);
      if (deleted) {
        return res.json({ success: true, message: 'Product deleted successfully', id });
      }
    }

    const initialLength = inMemoryProducts.length;
    inMemoryProducts = inMemoryProducts.filter((p) => p.id !== id && p._id !== id);

    if (inMemoryProducts.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, message: 'Product deleted successfully', id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
