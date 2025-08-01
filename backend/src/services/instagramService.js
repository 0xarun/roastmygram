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
      
      // Try Instagram's official API first
      try {
        const response = await axios.get(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
          headers: {
            'x-ig-app-id': this.igAppId,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'X-Requested-With': 'XMLHttpRequest'
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

          console.log(`✅ Successfully fetched @${username} via Instagram API:`, {
            followers: profileData.followersCount,
            following: profileData.followingCount,
            posts: profileData.postsCount
          });
          
          return profileData;
        }
      } catch (error) {
        console.log(`⚠️ Instagram API failed (${error.response?.status || 'unknown'}), trying alternative...`);
      }

      // Try free Instagram scraper service
      try {
        const scraperResponse = await axios.get(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          timeout: 15000
        });

        if (scraperResponse.data && scraperResponse.data.graphql && scraperResponse.data.graphql.user) {
          const user = scraperResponse.data.graphql.user;
          
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

          console.log(`✅ Successfully fetched @${username} via scraper:`, {
            followers: profileData.followersCount,
            following: profileData.followingCount,
            posts: profileData.postsCount
          });
          
          return profileData;
        }
      } catch (scraperError) {
        console.log(`⚠️ Scraper also failed: ${scraperError.message}`);
      }

      // Try public Instagram data API
      try {
        const publicResponse = await axios.get(`https://www.instagram.com/${username}/`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          timeout: 15000
        });

        // Extract data from HTML response
        const html = publicResponse.data;
        const followersMatch = html.match(/"edge_followed_by":{"count":(\d+)}/);
        const followingMatch = html.match(/"edge_follow":{"count":(\d+)}/);
        const postsMatch = html.match(/"edge_owner_to_timeline_media":{"count":(\d+)}/);
        const fullNameMatch = html.match(/"full_name":"([^"]+)"/);
        const bioMatch = html.match(/"biography":"([^"]*)"/);
        const profilePicMatch = html.match(/"profile_pic_url":"([^"]+)"/);

        if (followersMatch || followingMatch || postsMatch) {
          const profileData = {
            username: username,
            fullName: fullNameMatch ? fullNameMatch[1] : `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
            bio: bioMatch ? bioMatch[1] : null,
            followersCount: followersMatch ? parseInt(followersMatch[1]) : 0,
            followingCount: followingMatch ? parseInt(followingMatch[1]) : 0,
            postsCount: postsMatch ? parseInt(postsMatch[1]) : 0,
            profilePicUrl: profilePicMatch ? profilePicMatch[1] : `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=200`,
            isPrivate: false,
            isVerified: false,
            externalUrl: null,
            scrapedAt: new Date().toISOString()
          };

          // Cache the data
          this.setCachedData(username, profileData);

          console.log(`✅ Successfully fetched @${username} via public API:`, {
            followers: profileData.followersCount,
            following: profileData.followingCount,
            posts: profileData.postsCount
          });
          
          return profileData;
        }
      } catch (publicError) {
        console.log(`⚠️ Public API also failed: ${publicError.message}`);
      }

      // Try free Instagram API service
      try {
        const freeApiResponse = await axios.get(`https://api.instagram.com/v1/users/search?q=${username}&access_token=`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          timeout: 15000
        });

        if (freeApiResponse.data && freeApiResponse.data.data && freeApiResponse.data.data.length > 0) {
          const user = freeApiResponse.data.data.find(u => u.username === username);
          if (user) {
            const profileData = {
              username: user.username,
              fullName: user.full_name || `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
              bio: null,
              followersCount: user.counts?.followed_by || 0,
              followingCount: user.counts?.follows || 0,
              postsCount: user.counts?.media || 0,
              profilePicUrl: user.profile_picture || `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=200`,
              isPrivate: false,
              isVerified: false,
              externalUrl: null,
              scrapedAt: new Date().toISOString()
            };

            // Cache the data
            this.setCachedData(username, profileData);

            console.log(`✅ Successfully fetched @${username} via free API:`, {
              followers: profileData.followersCount,
              following: profileData.followingCount,
              posts: profileData.postsCount
            });
            
            return profileData;
          }
        }
      } catch (freeApiError) {
        console.log(`⚠️ Free API also failed: ${freeApiError.message}`);
      }

      // If all methods fail, use mock data
      throw new Error('All API methods failed');

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
    // Generate more realistic data based on username
    const followers = Math.floor(Math.random() * 5000) + 100;
    const following = Math.floor(Math.random() * 2000) + 50;
    const posts = Math.floor(Math.random() * 500) + 10;
    
    // Generate realistic bio based on username
    const bios = [
      "Living my best life ✨ | Coffee addict ☕ | Wanderlust 🌍 | DM for collabs 📩",
      "Building cool stuff 🚀 | Tech enthusiast 💻 | Coffee lover ☕",
      "Creative soul 🎨 | Adventure seeker 🌎 | Living authentically ✨",
      "Passionate about life 🌟 | Fitness junkie 💪 | Food lover 🍕",
      "Digital nomad 🌍 | Photography enthusiast 📸 | Minimalist lifestyle ✨"
    ];
    
    const randomBio = bios[Math.floor(Math.random() * bios.length)];
    
    return {
      username: username,
      fullName: `${username.charAt(0).toUpperCase()}${username.slice(1)} Vibes`,
      bio: randomBio,
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