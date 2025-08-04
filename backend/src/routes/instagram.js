const express = require('express');
const rateLimit = require('express-rate-limit');
const InstagramController = require('../controllers/instagramController');

const router = express.Router();
const controller = new InstagramController();

// Rate limiting for Instagram scraping endpoints
const scrapeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    error: 'Too many scraping requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const batchScrapeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 batch requests per windowMs
  message: {
    success: false,
    error: 'Too many batch scraping requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to scraping endpoints
router.use('/scrape', scrapeLimiter);
router.use('/batch', batchScrapeLimiter);

/**
 * @route GET /api/instagram/scrape/:username
 * @desc Scrape a single Instagram profile
 * @access Public
 */
router.get('/scrape/:username', async (req, res) => {
  await controller.scrapeProfile(req, res);
});

/**
 * @route POST /api/instagram/batch
 * @desc Scrape multiple Instagram profiles
 * @access Public
 */
router.post('/batch', async (req, res) => {
  await controller.scrapeMultipleProfiles(req, res);
});

/**
 * @route GET /api/instagram/stats/:username
 * @desc Get profile statistics only
 * @access Public
 */
router.get('/stats/:username', async (req, res) => {
  await controller.getProfileStats(req, res);
});

/**
 * @route GET /api/instagram/health
 * @desc Health check for Instagram scraper
 * @access Public
 */
router.get('/health', async (req, res) => {
  await controller.healthCheck(req, res);
});

/**
 * @route GET /api/instagram/info
 * @desc Get scraper information and capabilities
 * @access Public
 */
router.get('/info', async (req, res) => {
  await controller.getScraperInfo(req, res);
});

module.exports = router; 