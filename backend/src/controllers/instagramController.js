const InstagramScraper = require('../services/instagramScraper');

class InstagramController {
  constructor() {
    this.scraper = new InstagramScraper();
  }

  /**
   * Scrape a single Instagram profile
   */
  async scrapeProfile(req, res) {
    try {
      const { username } = req.params;
      
      if (!username) {
        return res.status(400).json({
          success: false,
          error: 'Username is required'
        });
      }

      // Validate username format
      if (!/^[a-zA-Z0-9._]+$/.test(username)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid username format'
        });
      }

      console.log(`🚀 Starting profile scrape for: ${username}`);
      
      const profile = await this.scraper.scrapeProfile(username);
      const stats = this.scraper.getProfileStats(profile);

      res.json({
        success: true,
        data: {
          profile,
          stats,
          scrapedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Profile scrape error:', error.message);
      
      let statusCode = 500;
      let errorMessage = 'Internal server error';

      if (error.message.includes('Profile not found')) {
        statusCode = 404;
        errorMessage = 'Profile not found';
      } else if (error.message.includes('Failed to fetch profile')) {
        statusCode = 503;
        errorMessage = 'Instagram service temporarily unavailable';
      } else if (error.message.includes('Could not extract profile data')) {
        statusCode = 422;
        errorMessage = 'Unable to extract profile data';
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Scrape multiple Instagram profiles
   */
  async scrapeMultipleProfiles(req, res) {
    try {
      const { usernames, delay = 2000 } = req.body;
      
      if (!usernames || !Array.isArray(usernames)) {
        return res.status(400).json({
          success: false,
          error: 'Usernames array is required'
        });
      }

      if (usernames.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one username is required'
        });
      }

      if (usernames.length > 10) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 10 usernames allowed per request'
        });
      }

      // Validate usernames
      const invalidUsernames = usernames.filter(username => !/^[a-zA-Z0-9._]+$/.test(username));
      if (invalidUsernames.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid username format',
          invalidUsernames
        });
      }

      console.log(`🚀 Starting batch scrape for ${usernames.length} profiles`);
      
      const results = await this.scraper.scrapeMultipleProfiles(usernames, delay);
      
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      res.json({
        success: true,
        data: {
          results,
          summary: {
            total: results.length,
            successful: successful.length,
            failed: failed.length,
            successRate: ((successful.length / results.length) * 100).toFixed(1)
          },
          scrapedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Batch scrape error:', error.message);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get profile statistics only
   */
  async getProfileStats(req, res) {
    try {
      const { username } = req.params;
      
      if (!username) {
        return res.status(400).json({
          success: false,
          error: 'Username is required'
        });
      }

      console.log(`📊 Getting stats for: ${username}`);
      
      const profile = await this.scraper.scrapeProfile(username);
      const stats = this.scraper.getProfileStats(profile);

      res.json({
        success: true,
        data: {
          username,
          stats,
          scrapedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Stats error:', error.message);
      
      let statusCode = 500;
      let errorMessage = 'Internal server error';

      if (error.message.includes('Profile not found')) {
        statusCode = 404;
        errorMessage = 'Profile not found';
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Health check for Instagram scraper
   */
  async healthCheck(req, res) {
    try {
      // Test with a known public profile
      const testUsername = 'instagram';
      
      console.log('🔍 Running Instagram scraper health check');
      
      const profile = await this.scraper.scrapeProfile(testUsername);
      
      res.json({
        success: true,
        message: 'Instagram scraper is working correctly',
        testProfile: {
          username: profile.username,
          followers: profile.followersCount,
          posts: profile.postsCount
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Health check failed:', error.message);
      
      res.status(503).json({
        success: false,
        error: 'Instagram scraper health check failed',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get scraper configuration info
   */
  async getScraperInfo(req, res) {
    res.json({
      success: true,
      data: {
        name: 'Instagram Profile Scraper',
        version: '1.0.0',
        features: [
          'Profile data extraction',
          'Recent posts analysis',
          'Engagement rate calculation',
          'Hashtag and mention extraction',
          'Batch profile scraping',
          'Proxy support',
          'Rate limiting protection'
        ],
        limits: {
          maxUsernamesPerRequest: 10,
          maxPostsPerProfile: 12,
          requestDelay: '2 seconds (configurable)'
        },
        supportedData: [
          'Basic profile info',
          'Follower/following counts',
          'Recent posts with engagement',
          'Profile verification status',
          'Business account info',
          'Hashtags and mentions',
          'Post timestamps and locations'
        ]
      }
    });
  }
}

module.exports = InstagramController; 