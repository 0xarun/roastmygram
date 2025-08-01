const axios = require('axios');

class InstagramService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60 * 60 * 1000; // 1 hour cache
    this.igAppId = '936619743392459';
  }

  // Check cache first
  getCachedData(username) {
    const cached = this.cache.get(username);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(username);
    return null;
  }

  // Cache the data
  setCachedData(username, data) {
    this.cache.set(username, {
      data,
      timestamp: Date.now()
    });
  }

  async scrapeProfile(username) {
    try {
      // Check cache first
      const cachedData = this.getCachedData(username);
      if (cachedData) {
        console.log(`📦 Using cached data for @${username}`);
        return cachedData;
      }

      console.log(`🔍 Fetching Instagram profile for @${username} via API`);
      
      // Use Instagram's official API
      const response = await axios.get(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
        headers: {
          'x-ig-app-id': this.igAppId,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      });

      if (response.data && response.data.data && response.data.data.user) {
        const user = response.data.data.user;
        
        const profileData = {
          username: user.username,
          fullName: user.full_name || `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
          bio: user.biography || null,
          followersCount: user.edge_followed_by?.count || 0,
          followingCount: user.edge_follow?.count || 0,
          postsCount: user.edge_owner_to_timeline_media?.count || 0,
          profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=200`,
          isPrivate: user.is_private || false,
          isVerified: user.is_verified || false,
          externalUrl: user.external_url || null,
          scrapedAt: new Date().toISOString()
        };

        // Cache the data
        this.setCachedData(username, profileData);

        console.log(`✅ Successfully fetched @${username}:`, {
          followers: profileData.followersCount,
          following: profileData.followingCount,
          posts: profileData.postsCount
        });
        
        return profileData;
      } else {
        throw new Error('Invalid API response structure');
      }

    } catch (error) {
      console.error(`❌ Error fetching @${username}:`, error.message);
      
      // Return fallback data with realistic mock values
      const mockData = this.generateMockData(username);
      
      // Cache the fallback data
      this.setCachedData(username, mockData);
      
      return mockData;
    }
  }

  // Generate realistic mock data when API fails
  generateMockData(username) {
    const followers = Math.floor(Math.random() * 5000) + 100;
    const following = Math.floor(Math.random() * 2000) + 50;
    const posts = Math.floor(Math.random() * 500) + 10;
    
    return {
      username: username,
      fullName: `${username.charAt(0).toUpperCase()}${username.slice(1)} Vibes`,
      bio: "Living my best life ✨ | Coffee addict ☕ | Wanderlust 🌍 | DM for collabs 📩",
      followersCount: followers,
      followingCount: following,
      postsCount: posts,
      profilePicUrl: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=200`,
      isPrivate: false,
      isVerified: Math.random() > 0.8,
      externalUrl: null,
      scrapedAt: new Date().toISOString(),
      isMockData: true
    };
  }

  // Generate roast based on profile data
  generateRoast(profileData) {
    const roasts = [
      `Your Instagram screams "I peaked in high school but make it aesthetic" 💅`,
      `You post motivational quotes but can't motivate yourself to post original content 📸`,
      `Your food pics are fire but your dating life is a burnt toast situation 🍞`,
      `${profileData.followersCount > 10000 ? 'You have followers but no real friends' : 'You have more filters than followers'} 😭`,
      `Your bio is longer than your attention span 📝`,
      `You're not verified, you're just verified in your own mind ✨`,
      `Your profile pic changes more often than your personality 🔄`,
      `You post stories but your life isn't story-worthy 📱`,
      `Your aesthetic is "I saw this on Pinterest once" 🎨`,
      `You have ${profileData.postsCount} posts but only ${profileData.followersCount} people who actually care 📊`
    ];

    // Use username hash for consistent roast selection
    const hash = profileData.username.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    return roasts[Math.abs(hash) % roasts.length];
  }

  // Cleanup method
  async cleanup() {
    this.cache.clear();
  }
}

module.exports = new InstagramService(); 