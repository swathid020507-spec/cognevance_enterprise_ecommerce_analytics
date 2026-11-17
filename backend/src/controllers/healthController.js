const mongoose = require('mongoose');

/**
 * Health check controller to verify API and Database status
 * Route: GET /api/health
 */
const getHealthStatus = (req, res) => {
  const dbStateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  const dbConnectionCode = mongoose.connection.readyState;
  const dbStatus = dbStateMap[dbConnectionCode] || 'Unknown';

  const healthData = {
    status: 'OK',
    project: 'Cognevance Enterprise E-Commerce & Analytics Platform',
    service: 'Backend REST API',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      readyState: dbConnectionCode,
      name: mongoose.connection.name || 'N/A'
    }
  };

  return res.status(200).json(healthData);
};

module.exports = {
  getHealthStatus
};
