const User = require('../models/User');
const { isDbConnected } = require('../config/db');

// In-memory demo users
const inMemoryUsers = [
  {
    _id: 'user-admin',
    name: 'Executive Admin',
    email: 'admin@cognevance.com',
    role: 'admin',
    token: 'demo-token-admin'
  },
  {
    _id: 'user-customer',
    name: 'Enterprise Client',
    email: 'customer@cognevance.com',
    role: 'customer',
    token: 'demo-token-customer'
  }
];

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check pre-configured demo users
    if (cleanEmail === 'admin@cognevance.com' && password === 'admin123') {
      return res.json({
        success: true,
        message: 'Admin authenticated successfully',
        data: inMemoryUsers[0]
      });
    }

    if (cleanEmail === 'customer@cognevance.com' && password === 'customer123') {
      return res.json({
        success: true,
        message: 'Customer authenticated successfully',
        data: inMemoryUsers[1]
      });
    }

    // Check DB or memory
    if (isDbConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (user && user.password === password) {
        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: `token-${user._id}`
          }
        });
      }
    }

    const memoryUser = inMemoryUsers.find((u) => u.email === cleanEmail);
    if (memoryUser) {
      return res.json({
        success: true,
        message: 'Login successful',
        data: memoryUser
      });
    }

    // If new user for demo, accept and auto-login
    const autoUser = {
      _id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: cleanEmail,
      role: cleanEmail.includes('admin') ? 'admin' : 'customer',
      token: `token-${Date.now()}`
    };
    inMemoryUsers.push(autoUser);

    return res.json({
      success: true,
      message: 'Logged in successfully',
      data: autoUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }

      const newUser = await User.create({
        name,
        email: cleanEmail,
        password,
        role
      });

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          token: `token-${newUser._id}`
        }
      });
    }

    const newMemUser = {
      _id: `user-${Date.now()}`,
      name,
      email: cleanEmail,
      role,
      token: `token-${Date.now()}`
    };
    inMemoryUsers.push(newMemUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: newMemUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  return res.json({
    success: true,
    data: inMemoryUsers[1]
  });
};

module.exports = {
  login,
  register,
  getCurrentUser
};
