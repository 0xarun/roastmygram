const instagramService = require('../services/instagramService');
const databaseService = require('../services/databaseService');

class RoastController {
  // Main endpoint to roast an Instagram profile
  async roastProfile(req, res, next) {
    try {
      const { username } = req.body;

      // Validate username
      if (!username || typeof username !== 'string') {
        return res.status(400).json({
          error: {
            message: 'Username is required and must be a string',
            code: 'INVALID_USERNAME'
          }
        });
      }

      // Clean username (remove @ if present)
      const cleanUsername = username.replace('@', '').trim();
      
      if (cleanUsername.length < 1) {
        return res.status(400).json({
          error: {
            message: 'Username cannot be empty',
            code: 'EMPTY_USERNAME'
          }
        });
      }

      console.log(`🔥 Starting roast process for @${cleanUsername}`);

      // Step 1: Scrape Instagram profile data
      const profileData = await instagramService.scrapeProfile(cleanUsername);

      // Step 2: Generate roast based on profile data
      const roastText = instagramService.generateRoast(profileData);

      // Step 3: Get or create user in database
      const user = await databaseService.getOrCreateUser(cleanUsername);

      // Step 4: Create roast record
      const roast = await databaseService.createRoast(user._id, roastText);

      // Step 5: Get roast count for this user
      const roastCount = await databaseService.getRoastCount(user._id);

      // Step 6: Get recent roasts
      const recentRoasts = await databaseService.getRecentRoasts(user._id, 3);

      // Step 7: Get total stats
      const totalStats = await databaseService.getTotalStats();

      // Prepare response
      const response = {
        success: true,
        data: {
          user: {
            id: user._id,
            username: user.username,
            createdAt: user.created_at
          },
          profile: {
            username: profileData.username,
            fullName: profileData.fullName,
            bio: profileData.bio,
            followersCount: profileData.followersCount,
            followingCount: profileData.followingCount,
            postsCount: profileData.postsCount,
            profilePicUrl: profileData.profilePicUrl,
            isPrivate: profileData.isPrivate,
            isVerified: profileData.isVerified,
            scrapedAt: profileData.scrapedAt
          },
          roast: {
            id: roast._id,
            text: roast.roast_text,
            createdAt: roast.created_at
          },
          stats: {
            userRoastCount: roastCount,
            totalUsers: totalStats.totalUsers,
            totalRoasts: totalStats.totalRoasts
          },
          recentRoasts: recentRoasts.map(r => ({
            id: r._id,
            text: r.roast_text,
            createdAt: r.created_at
          }))
        },
        message: `🔥 Successfully roasted @${cleanUsername}!`
      };

      console.log(`✅ Roast completed for @${cleanUsername}`);
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Error in roastProfile:', error);
      next(error);
    }
  }

  // Get roast statistics
  async getStats(req, res, next) {
    try {
      const stats = await databaseService.getTotalStats();
      
      res.status(200).json({
        success: true,
        data: stats,
        message: '📊 Statistics retrieved successfully'
      });
    } catch (error) {
      console.error('❌ Error in getStats:', error);
      next(error);
    }
  }

  // Get user's roast history
  async getUserRoasts(req, res, next) {
    try {
      const { username } = req.params;
      
      if (!username) {
        return res.status(400).json({
          error: {
            message: 'Username is required',
            code: 'MISSING_USERNAME'
          }
        });
      }

      const cleanUsername = username.replace('@', '').trim();
      
      // Get user
      const user = await databaseService.getOrCreateUser(cleanUsername);
      
      // Get roast count
      const roastCount = await databaseService.getRoastCount(user._id);
      
      // Get recent roasts
      const recentRoasts = await databaseService.getRecentRoasts(user._id, 10);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            username: user.username,
            createdAt: user.created_at
          },
          roastCount: roastCount,
          roasts: recentRoasts.map(r => ({
            id: r._id,
            text: r.roast_text,
            createdAt: r.created_at
          }))
        },
        message: `📝 Found ${roastCount} roasts for @${cleanUsername}`
      });

    } catch (error) {
      console.error('❌ Error in getUserRoasts:', error);
      next(error);
    }
  }

  // Health check endpoint
  async healthCheck(req, res) {
    try {
      const stats = await databaseService.getTotalStats();
      
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        stats: stats,
        message: '🔥 Roast My Insta API is running smoothly!'
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        message: '❌ API is experiencing issues'
      });
    }
  }
}

module.exports = new RoastController(); 