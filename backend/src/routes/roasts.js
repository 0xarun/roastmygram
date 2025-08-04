const express = require('express');
const router = express.Router();
const roastController = require('../controllers/roastController');
const axios = require('axios');

// Main endpoint to roast an Instagram profile
// POST /api/roasts
router.post('/', roastController.roastProfile);

// Get roast statistics
// GET /api/roasts/stats
router.get('/stats', roastController.getStats);

// Get user's roast history
// GET /api/roasts/user/:username
router.get('/user/:username', roastController.getUserRoasts);

// Proxy image endpoint to avoid CORS issues
// GET /api/roasts/proxy-image
router.get('/proxy-image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log(`🖼️ Proxying image: ${url}`);
    
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.instagram.com/'
      }
    });

    // Set appropriate headers
    res.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.set('Access-Control-Allow-Origin', '*');
    
    // Pipe the image data to response
    response.data.pipe(res);
    
  } catch (error) {
    console.error('❌ Error proxying image:', error.message);
    res.status(500).json({ error: 'Failed to load image' });
  }
});

module.exports = router; 