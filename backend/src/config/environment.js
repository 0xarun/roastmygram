// Environment configuration
const config = {
  development: {
    corsOrigins: ['http://localhost:3000'],
    apiUrl: 'http://localhost:5000',
    frontendUrl: 'http://localhost:3000'
  },
  production: {
    corsOrigins: [
      'https://roastmygram.fun',
      'https://www.roastmygram.fun'
    ],
    apiUrl: process.env.BACKEND_URL || 'https://your-backend-url.onrender.com',
    frontendUrl: 'https://roastmygram.fun'
  }
};

const currentEnv = process.env.NODE_ENV || 'development';
const currentConfig = config[currentEnv];

module.exports = {
  ...currentConfig,
  isProduction: currentEnv === 'production',
  isDevelopment: currentEnv === 'development'
}; 