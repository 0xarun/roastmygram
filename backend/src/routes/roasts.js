const express = require('express');
const router = express.Router();
const roastController = require('../controllers/roastController');

// Main endpoint to roast an Instagram profile
// POST /api/roasts
router.post('/', roastController.roastProfile);

// Get roast statistics
// GET /api/roasts/stats
router.get('/stats', roastController.getStats);

// Get user's roast history
// GET /api/roasts/user/:username
router.get('/user/:username', roastController.getUserRoasts);

module.exports = router; 