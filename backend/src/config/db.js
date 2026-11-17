const mongoose = require('mongoose');

/**
 * Connect to MongoDB database using Mongoose and auto-seed if needed
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(' [Warning]: MONGODB_URI is not set. Operating in memory fallback mode.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed initial sample products if collection is empty
    try {
      const Product = require('../models/Product');
      const count = await Product.countDocuments();
      if (count === 0) {
        const sampleProducts = require('../data/sampleProducts');
        // Clean sample items for MongoDB insertion
        const seedData = sampleProducts.map(({ id, ...rest }) => rest);
        await Product.insertMany(seedData);
        console.log(` Seeded ${seedData.length} initial products into MongoDB.`);
      }
    } catch (seedErr) {
      console.warn(` [Seed Warning]: ${seedErr.message}`);
    }
  } catch (error) {
    console.error(` [Database Connection Error]: ${error.message}`);
    console.warn(' Application will continue using memory fallback for API requests.');
  }
};

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
