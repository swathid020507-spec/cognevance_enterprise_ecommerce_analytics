// Load environment variables as early as possible
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start Express HTTP Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Cognevance Enterprise E-Commerce Backend API`);
  console.log(`  Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`  Health Check URL: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
