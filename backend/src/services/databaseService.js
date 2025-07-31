const User = require('../models/User');
const Roast = require('../models/Roast');

class DatabaseService {
  // Get or create user by username
  async getOrCreateUser(username) {
    try {
      // Check if user exists
      let user = await User.findOne({ username: username.toLowerCase() });

      if (user) {
        return user;
      }

      // Create new user
      user = new User({
        username: username.toLowerCase()
      });

      await user.save();
      return user;
    } catch (error) {
      console.error('Error in getOrCreateUser:', error);
      throw error;
    }
  }

  // Create a new roast
  async createRoast(userId, roastText) {
    try {
      const roast = new Roast({
        user_id: userId,
        roast_text: roastText
      });

      await roast.save();
      return roast;
    } catch (error) {
      console.error('Error in createRoast:', error);
      throw error;
    }
  }

  // Get roast count for a user
  async getRoastCount(userId) {
    try {
      const count = await Roast.countDocuments({ user_id: userId });
      return count;
    } catch (error) {
      console.error('Error in getRoastCount:', error);
      throw error;
    }
  }

  // Get recent roasts for a user
  async getRecentRoasts(userId, limit = 5) {
    try {
      const roasts = await Roast.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(limit);
      
      return roasts;
    } catch (error) {
      console.error('Error in getRecentRoasts:', error);
      throw error;
    }
  }

  // Get total roast statistics
  async getTotalStats() {
    try {
      const totalUsers = await User.countDocuments();
      const totalRoasts = await Roast.countDocuments();

      return {
        totalUsers: totalUsers,
        totalRoasts: totalRoasts
      };
    } catch (error) {
      console.error('Error in getTotalStats:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseService(); 