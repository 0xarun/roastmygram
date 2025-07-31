// Application constants
const CACHE_TIMEOUT = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 100; // requests per window

// Instagram scraping constants
const INSTAGRAM_TIMEOUT = 10000; // 10 seconds
const INSTAGRAM_WAIT_TIMEOUT = 5000; // 5 seconds

// API response messages
const MESSAGES = {
  ROAST_SUCCESS: '🔥 Successfully roasted @{username}!',
  STATS_SUCCESS: '📊 Statistics retrieved successfully',
  USER_ROASTS_SUCCESS: '📝 Found {count} roasts for @{username}',
  HEALTH_OK: '🔥 Roast My Insta API is running smoothly!',
  HEALTH_ERROR: '❌ API is experiencing issues'
};

module.exports = {
  CACHE_TIMEOUT,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX,
  INSTAGRAM_TIMEOUT,
  INSTAGRAM_WAIT_TIMEOUT,
  MESSAGES
}; 