const axios = require('axios');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');
const HttpsProxyAgent = require('https-proxy-agent');

class InstagramScraper {
  constructor() {
    this.userAgents = new UserAgent();
    this.axiosInstance = axios.create({
      timeout: 30000,
      maxRedirects: 5
    });
  }

  /**
   * Get a random user agent
   */
  getRandomUserAgent() {
    return this.userAgents.toString();
  }

  /**
   * Create request configuration
   */
  createRequestConfig(useProxy = false) {
    const config = {
      headers: {
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      }
    };

    if (useProxy && process.env.PROXY_URL) {
      config.httpsAgent = new HttpsProxyAgent(process.env.PROXY_URL);
    }

    return config;
  }

  /**
   * Scrape Instagram profile using third-party API (Primary Method)
   */
  async scrapeProfileViaThirdParty(username) {
    try {
      console.log(`🔍 Scraping ${username} via third-party API...`);
      
      const response = await axios.post('http://api.scraping-bot.io/scrape/data-scraper', {
        "scraper": "instagramProfile",
        "account": username,
        "posts_number": "12",
      }, {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Basic ' + Buffer.from('0xarun:hfjuWLHaSagPZzWQ1aDAKtriG').toString('base64')
        },
        timeout: 60000
      });

      console.log("📡 Response ID received:", response.data.responseId);
      
      let finalData;
      let attempts = 0;
      const maxAttempts = 12; // 1 minute max wait time
      
      do {
        // Wait 5 seconds between checks
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
        
        console.log(`⏳ Checking for data... (attempt ${attempts}/${maxAttempts})`);
        
        const responseUrl = `http://api.scraping-bot.io/scrape/data-scraper-response?scraper=instagramProfile&responseId=${response.data.responseId}`;
        
        const dataResponse = await axios.get(responseUrl, {
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic ' + Buffer.from('0xarun:hfjuWLHaSagPZzWQ1aDAKtriG').toString('base64')
          },
          timeout: 30000
        });
        
        finalData = dataResponse.data;
        console.log("📊 Status:", finalData?.status || 'null');
        
        if (attempts >= maxAttempts) {
          console.log("⏰ Timeout reached, stopping...");
          break;
        }
        
      } while (finalData == null || finalData.status === "pending");
      
      if (!finalData || !Array.isArray(finalData) || finalData.length === 0) {
        throw new Error('No data received from third-party service');
      }

      // Transform the data to match our standard format
      const transformedData = this.transformThirdPartyData(finalData, username);
      
      console.log(`✅ Successfully scraped ${username} via third-party API`);
      return transformedData;
      
    } catch (error) {
      console.error(`❌ Error scraping ${username} via third-party API:`, error.message);
      throw error;
    }
  }

  /**
   * Transform third-party data to our standard format
   */
  transformThirdPartyData(rawData, username) {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      throw new Error('Invalid data received from third-party service');
    }

    // Get profile info from the first post
    const firstPost = rawData[0];
    
    const profile = {
      username: username,
      fullName: firstPost.profile_name || '',
      biography: firstPost.biography || '',
      profilePicUrl: firstPost.profile_image_link || '',
      profilePicUrlHd: firstPost.profile_image_link || '',
      isPrivate: false, // Third-party service only scrapes public profiles
      isVerified: firstPost.is_verified || false,
      isBusinessAccount: false, // Not provided by third-party service
      isProfessionalAccount: false,
      businessCategoryName: '',
      categoryName: '',
      externalUrl: firstPost.external_url || '',
      followersCount: firstPost.followers || 0,
      followingCount: firstPost.following || 0,
      postsCount: firstPost.posts_count || 0,
      totalPosts: firstPost.posts_count || 0,
      scrapedAt: new Date().toISOString()
    };

    // Transform posts
    profile.recentPosts = rawData.map(post => ({
      id: post.id,
      shortcode: post.url ? post.url.split('/p/')[1]?.split('/')[0] : '',
      displayUrl: post.image_url || '',
      thumbnailUrl: post.thumbnail_src || '',
      isVideo: post.media_type === 'Reels' || post.video_url,
      videoUrl: post.video_url || null,
      caption: post.caption || '',
      likesCount: post.likes || 0,
      commentsCount: post.comments || 0,
      timestamp: post.datetime ? new Date(post.datetime).toISOString() : null,
      location: null, // Not provided by third-party service
      hashtags: this.extractHashtags(post.caption || ''),
      mentions: this.extractMentions(post.caption || ''),
      videoViewCount: post.video_view_count || 0,
      mediaType: post.media_type || 'Image'
    }));

    return profile;
  }

  /**
   * Extract hashtags from text
   */
  extractHashtags(text) {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    return text.match(hashtagRegex) || [];
  }

  /**
   * Extract mentions from text
   */
  extractMentions(text) {
    const mentionRegex = /@[\w.]+/g;
    return text.match(mentionRegex) || [];
  }

  /**
   * Scrape Instagram profile using Instagram's API (Fallback Method 1)
   */
  async scrapeProfileViaAPI(username) {
    try {
      console.log(`🔍 Scraping profile via Instagram API for: ${username}`);
      const apiUrl = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
      const config = this.createRequestConfig(false);
      config.headers['X-IG-App-ID'] = '936619743392459';
      config.headers['X-IG-WWW-Claim'] = '0';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      config.headers['Referer'] = 'https://www.instagram.com/';
      config.headers['Origin'] = 'https://www.instagram.com';
      
      console.log(`🌐 Making API request to: ${apiUrl}`);
      const response = await this.axiosInstance.get(apiUrl, config);
      console.log(`📡 API Response status: ${response.status}`);
      
      if (response.status === 404) {
        throw new Error('Profile not found');
      }
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: Failed to fetch profile via API`);
      }
      
      const data = response.data;
      console.log('✅ API response received:', Object.keys(data));
      
      let userData = null;
      if (data.user) {
        userData = data.user;
        console.log('✅ Found user data in data.user');
      } else if (data.data && data.data.user) {
        userData = data.data.user;
        console.log('✅ Found user data in data.data.user');
      } else if (data.status === 'ok' && data.data) {
        userData = data.data;
        console.log('✅ Found user data in data.data');
      }
      
      if (!userData) {
        console.log('❌ No user data found in API response');
        console.log('🔍 Available data structure:', JSON.stringify(data, null, 2).substring(0, 1000) + '...');
        throw new Error('No user data in API response');
      }
      
      console.log('✅ User data found:', {
        username: userData.username,
        hasFollowers: !!userData.follower_count || !!userData.edge_followed_by,
        hasPosts: !!userData.media_count || !!userData.edge_owner_to_timeline_media
      });
      
      const profile = {
        username: userData.username || username,
        fullName: userData.full_name || '',
        biography: userData.biography || '',
        profilePicUrl: userData.profile_pic_url || '',
        profilePicUrlHd: userData.profile_pic_url_hd || '',
        isPrivate: userData.is_private || false,
        isVerified: userData.is_verified || false,
        isBusinessAccount: userData.is_business_account || false,
        isProfessionalAccount: userData.is_professional_account || false,
        businessCategoryName: userData.business_category_name || '',
        categoryName: userData.category_name || '',
        externalUrl: userData.external_url || '',
        followersCount: userData.follower_count || userData.edge_followed_by?.count || 0,
        followingCount: userData.following_count || userData.edge_follow?.count || 0,
        postsCount: userData.media_count || userData.edge_owner_to_timeline_media?.count || 0,
        totalPosts: userData.media_count || userData.edge_owner_to_timeline_media?.count || 0,
        scrapedAt: new Date().toISOString()
      };

      if (data.items && Array.isArray(data.items)) {
        profile.recentPosts = data.items.slice(0, 12).map(item => ({
          id: item.id,
          shortcode: item.code,
          displayUrl: item.image_versions2?.candidates?.[0]?.url || '',
          thumbnailUrl: item.image_versions2?.candidates?.[1]?.url || '',
          isVideo: item.media_type === 2,
          videoUrl: item.video_versions?.[0]?.url || null,
          caption: item.caption?.text || '',
          likesCount: item.like_count || 0,
          commentsCount: item.comment_count || 0,
          timestamp: item.taken_at ? new Date(item.taken_at * 1000).toISOString() : null,
          location: item.location?.name || null,
          hashtags: this.extractHashtags(item.caption?.text || ''),
          mentions: this.extractMentions(item.caption?.text || '')
        }));
      } else if (userData.edge_owner_to_timeline_media && userData.edge_owner_to_timeline_media.edges) {
        profile.recentPosts = userData.edge_owner_to_timeline_media.edges.slice(0, 12).map(edge => {
          const node = edge.node;
          return {
            id: node.id,
            shortcode: node.shortcode,
            displayUrl: node.display_url,
            thumbnailUrl: node.thumbnail_src,
            isVideo: node.is_video,
            videoUrl: node.video_url || null,
            caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
            likesCount: node.edge_media_preview_like?.count || 0,
            commentsCount: node.edge_media_to_comment?.count || 0,
            timestamp: node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000).toISOString() : null,
            location: node.location?.name || null,
            hashtags: this.extractHashtags(node.edge_media_to_caption?.edges?.[0]?.node?.text || ''),
            mentions: this.extractMentions(node.edge_media_to_caption?.edges?.[0]?.node?.text || '')
          };
        });
      }

      console.log(`✅ Successfully scraped profile via API for: ${username}`);
      return profile;
    } catch (error) {
      console.error(`❌ Error scraping profile via API for ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Extract JSON data from HTML
   */
  extractJsonData(html) {
    console.log('🔍 Extracting JSON data from HTML...');
    
    const $ = cheerio.load(html);
    
    // Method 1: Look for window._sharedData
    let jsonData = null;
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html();
      if (scriptContent && scriptContent.includes('window._sharedData')) {
        const match = scriptContent.match(/window\._sharedData\s*=\s*({.+?});/);
        if (match) {
          try {
            jsonData = JSON.parse(match[1]);
            console.log('✅ Found data in window._sharedData');
            return false; // Break the loop
          } catch (e) {
            console.log('❌ Failed to parse window._sharedData');
          }
        }
      }
    });

    // Method 2: Look for application/ld+json
    if (!jsonData) {
      $('script[type="application/ld+json"]').each((i, elem) => {
        try {
          const data = JSON.parse($(elem).html());
          if (data && (data.mainEntityofPage || data.author)) {
            jsonData = data;
            console.log('✅ Found data in application/ld+json');
            return false;
          }
        } catch (e) {
          console.log('❌ Failed to parse application/ld+json');
        }
      });
    }

    // Method 3: Look for __NEXT_DATA__
    if (!jsonData) {
      $('script#__NEXT_DATA__').each((i, elem) => {
        try {
          const data = JSON.parse($(elem).html());
          if (data && data.props && data.props.pageProps) {
            jsonData = data;
            console.log('✅ Found data in __NEXT_DATA__');
            return false;
          }
        } catch (e) {
          console.log('❌ Failed to parse __NEXT_DATA__');
        }
      });
    }

    // Method 4: Look for any script with user data
    if (!jsonData) {
      $('script').each((i, elem) => {
        const scriptContent = $(elem).html();
        if (scriptContent && scriptContent.includes('"user"') && scriptContent.includes('"username"')) {
          try {
            const match = scriptContent.match(/\{[^{}]*"user"[^{}]*\}/);
            if (match) {
              jsonData = JSON.parse(match[0]);
              console.log('✅ Found user data in generic script');
              return false;
            }
          } catch (e) {
            console.log('❌ Failed to parse generic script');
          }
        }
      });
    }

    if (!jsonData) {
      console.log('❌ No JSON data found in HTML');
      console.log('🔍 HTML preview:', html.substring(0, 500) + '...');
    }

    return jsonData;
  }

  /**
   * Parse profile data from JSON
   */
  parseProfileData(jsonData, username) {
    console.log('🔍 Parsing profile data from JSON...');
    console.log('📊 JSON keys:', Object.keys(jsonData));
    
    let userData = null;
    
    // Try different possible structures
    if (jsonData.user) {
      userData = jsonData.user;
      console.log('✅ Found user data in jsonData.user');
    } else if (jsonData.data && jsonData.data.user) {
      userData = jsonData.data.user;
      console.log('✅ Found user data in jsonData.data.user');
    } else if (jsonData.entry_data && jsonData.entry_data.ProfilePage && jsonData.entry_data.ProfilePage[0]) {
      userData = jsonData.entry_data.ProfilePage[0].graphql.user;
      console.log('✅ Found user data in entry_data.ProfilePage');
    } else if (jsonData.props && jsonData.props.pageProps && jsonData.props.pageProps.user) {
      userData = jsonData.props.pageProps.user;
      console.log('✅ Found user data in props.pageProps.user');
    } else if (jsonData.mainEntityofPage && jsonData.mainEntityofPage.author) {
      userData = jsonData.mainEntityofPage.author;
      console.log('✅ Found user data in mainEntityofPage.author');
    }

    if (!userData) {
      console.log('❌ No user data found in JSON structure');
      console.log('🔍 Available structure:', JSON.stringify(jsonData, null, 2).substring(0, 1000) + '...');
      throw new Error('Could not extract profile data from page');
    }

    console.log('✅ User data found:', {
      username: userData.username,
      hasFollowers: !!userData.follower_count || !!userData.edge_followed_by,
      hasPosts: !!userData.media_count || !!userData.edge_owner_to_timeline_media
    });

    const profile = {
      username: userData.username || username,
      fullName: userData.full_name || userData.name || '',
      biography: userData.biography || userData.bio || '',
      profilePicUrl: userData.profile_pic_url || userData.profile_pic_url_hd || '',
      profilePicUrlHd: userData.profile_pic_url_hd || userData.profile_pic_url || '',
      isPrivate: userData.is_private || false,
      isVerified: userData.is_verified || false,
      isBusinessAccount: userData.is_business_account || false,
      isProfessionalAccount: userData.is_professional_account || false,
      businessCategoryName: userData.business_category_name || '',
      categoryName: userData.category_name || '',
      externalUrl: userData.external_url || '',
      followersCount: userData.follower_count || userData.edge_followed_by?.count || 0,
      followingCount: userData.following_count || userData.edge_follow?.count || 0,
      postsCount: userData.media_count || userData.edge_owner_to_timeline_media?.count || 0,
      totalPosts: userData.media_count || userData.edge_owner_to_timeline_media?.count || 0,
      scrapedAt: new Date().toISOString()
    };

    // Extract recent posts if available
    if (userData.edge_owner_to_timeline_media && userData.edge_owner_to_timeline_media.edges) {
      profile.recentPosts = userData.edge_owner_to_timeline_media.edges.slice(0, 12).map(edge => {
        const node = edge.node;
        return {
          id: node.id,
          shortcode: node.shortcode,
          displayUrl: node.display_url,
          thumbnailUrl: node.thumbnail_src,
          isVideo: node.is_video,
          videoUrl: node.video_url || null,
          caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || '',
          likesCount: node.edge_media_preview_like?.count || 0,
          commentsCount: node.edge_media_to_comment?.count || 0,
          timestamp: node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000).toISOString() : null,
          location: node.location?.name || null,
          hashtags: this.extractHashtags(node.edge_media_to_caption?.edges?.[0]?.node?.text || ''),
          mentions: this.extractMentions(node.edge_media_to_caption?.edges?.[0]?.node?.text || '')
        };
      });
    }

    return profile;
  }

  /**
   * Scrape Instagram profile using HTML parsing (Fallback Method 2)
   */
  async scrapeProfileViaHTML(username) {
    try {
      console.log(`🔍 Scraping profile via HTML for: ${username}`);
      const url = `https://www.instagram.com/${username}/`;
      const config = this.createRequestConfig(false);
      
      console.log(`🌐 Making HTML request to: ${url}`);
      const response = await this.axiosInstance.get(url, config);
      console.log(`📡 HTML Response status: ${response.status}`);
      
      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: Failed to fetch profile page`);
      }

      const jsonData = this.extractJsonData(response.data);
      if (!jsonData) {
        throw new Error('Could not extract profile data from page');
      }

      const profile = this.parseProfileData(jsonData, username);
      console.log(`✅ Successfully scraped profile via HTML for: ${username}`);
      return profile;
      
    } catch (error) {
      console.error(`❌ Error scraping profile via HTML for ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Main scraping method - tries third-party API first, then falls back to other methods
   */
  async scrapeProfile(username) {
    console.log(`🚀 Starting scrape for: ${username}`);
    
    // Method 1: Try third-party API first
    try {
      return await this.scrapeProfileViaThirdParty(username);
    } catch (error) {
      console.log(`⚠️ Third-party API failed: ${error.message}`);
    }

    // Method 2: Try Instagram API
    try {
      return await this.scrapeProfileViaAPI(username);
    } catch (error) {
      console.log(`⚠️ Instagram API failed: ${error.message}`);
    }

    // Method 3: Try HTML parsing
    try {
      return await this.scrapeProfileViaHTML(username);
    } catch (error) {
      console.log(`⚠️ HTML parsing failed: ${error.message}`);
    }

    // All methods failed
    throw new Error(`Failed to scrape profile for ${username} using all available methods`);
  }

  /**
   * Scrape multiple profiles
   */
  async scrapeMultipleProfiles(usernames, delay = 5000) {
    const results = [];
    
    for (let i = 0; i < usernames.length; i++) {
      try {
        const username = usernames[i];
        console.log(`📊 Scraping ${i + 1}/${usernames.length}: ${username}`);
        
        const profile = await this.scrapeProfile(username);
        results.push({
          username,
          success: true,
          data: profile
        });

        // Add delay between requests
        if (i < usernames.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

      } catch (error) {
        console.error(`❌ Failed to scrape ${usernames[i]}:`, error.message);
        results.push({
          username: usernames[i],
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Get profile statistics summary
   */
  getProfileStats(profile) {
    return {
      username: profile.username,
      followers: profile.followersCount,
      following: profile.followingCount,
      posts: profile.postsCount,
      engagementRate: this.calculateEngagementRate(profile),
      averageLikes: this.calculateAverageLikes(profile),
      averageComments: this.calculateAverageComments(profile),
      isPrivate: profile.isPrivate,
      isVerified: profile.isVerified,
      isBusiness: profile.isBusinessAccount
    };
  }

  /**
   * Calculate engagement rate
   */
  calculateEngagementRate(profile) {
    if (!profile.recentPosts || profile.recentPosts.length === 0 || profile.followersCount === 0) {
      return 0;
    }

    const totalEngagement = profile.recentPosts.reduce((sum, post) => {
      return sum + (post.likesCount || 0) + (post.commentsCount || 0);
    }, 0);

    const avgEngagement = totalEngagement / profile.recentPosts.length;
    return ((avgEngagement / profile.followersCount) * 100).toFixed(2);
  }

  /**
   * Calculate average likes
   */
  calculateAverageLikes(profile) {
    if (!profile.recentPosts || profile.recentPosts.length === 0) {
      return 0;
    }

    const totalLikes = profile.recentPosts.reduce((sum, post) => sum + (post.likesCount || 0), 0);
    return Math.round(totalLikes / profile.recentPosts.length);
  }

  /**
   * Calculate average comments
   */
  calculateAverageComments(profile) {
    if (!profile.recentPosts || profile.recentPosts.length === 0) {
      return 0;
    }

    const totalComments = profile.recentPosts.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
    return Math.round(totalComments / profile.recentPosts.length);
  }
}

module.exports = InstagramScraper; 