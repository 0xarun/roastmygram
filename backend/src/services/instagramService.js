const puppeteer = require('puppeteer');

class InstagramService {
  constructor() {
    this.browser = null;
    this.cache = new Map();
    this.cacheTimeout = 60 * 60 * 1000; // 1 hour cache
  }

  async initBrowser() {
    if (!this.browser) {
      try {
        // Use regular puppeteer for both development and production
        this.browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        });
      } catch (error) {
        console.error('❌ Failed to launch browser:', error.message);
        return null;
      }
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
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

      console.log(`🔍 Scraping Instagram profile for @${username}`);
      
      const browser = await this.initBrowser();
      if (!browser) {
        console.log('⚠️ Browser could not be initialized, returning mock data.');
        const mockData = this.generateMockData(username);
        this.setCachedData(username, mockData);
        return mockData;
      }

      const page = await browser.newPage();

      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Set viewport
      await page.setViewport({ width: 1280, height: 720 });

      // Block unnecessary resources for faster loading
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Navigate to Instagram profile
      await page.goto(`https://www.instagram.com/${username}/`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

             // Wait for content to load and try to find key elements
       await page.waitForTimeout(5000);

       // Debug: Log page content to see what we're working with
       console.log(`🔍 Page title: ${await page.title()}`);
       console.log(`🔍 Page URL: ${page.url()}`);

       // Try to wait for specific elements to appear
       try {
         await page.waitForSelector('main', { timeout: 10000 });
       } catch (e) {
         console.log('⚠️ Main element not found, continuing anyway...');
       }

       // Extract profile data with improved selectors
             const profileData = await page.evaluate((username) => {
         // Helper function to extract numbers from text
         const extractNumber = (text) => {
           if (!text) return 0;
           const match = text.replace(/,/g, '').match(/(\d+(?:\.\d+)?[KMB]?)/);
           if (!match) return 0;
           const num = match[1];
           if (num.includes('K')) return parseInt(num.replace('K', '')) * 1000;
           if (num.includes('M')) return parseInt(num.replace('M', '')) * 1000000;
           if (num.includes('B')) return parseInt(num.replace('B', '')) * 1000000000;
           return parseInt(num);
         };

         // Get meta content
         const getMetaContent = (property) => {
           const meta = document.querySelector(`meta[property="${property}"]`);
           return meta ? meta.getAttribute('content') : null;
         };

         // Debug: Log all text content to understand the page structure
         console.log('🔍 Analyzing page structure...');
         
         // Get all text content from the page
         const allText = document.body.innerText;
         console.log('🔍 All page text:', allText.substring(0, 500) + '...');

         // Try to find stats in multiple ways
         let followers = 0;
         let following = 0;
         let posts = 0;

         // Method 1: Look for patterns in all text
         const textLines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
         console.log('🔍 Text lines found:', textLines.length);
         
         for (const line of textLines) {
           const lowerLine = line.toLowerCase();
           if (lowerLine.includes('followers') && !followers) {
             followers = extractNumber(line);
             console.log(`✅ Found followers: ${followers} from line: "${line}"`);
           } else if (lowerLine.includes('following') && !following) {
             following = extractNumber(line);
             console.log(`✅ Found following: ${following} from line: "${line}"`);
           } else if (lowerLine.includes('posts') && !posts) {
             posts = extractNumber(line);
             console.log(`✅ Found posts: ${posts} from line: "${line}"`);
           }
         }

         // Method 2: Look for stats in specific elements if method 1 failed
         if (!followers || !following || !posts) {
           console.log('🔍 Trying element-based extraction...');
           
           // Look for stats in list items
           const listItems = document.querySelectorAll('li');
           listItems.forEach(li => {
             const text = li.textContent.toLowerCase();
             if (text.includes('followers') && !followers) {
               followers = extractNumber(li.textContent);
               console.log(`✅ Found followers in li: ${followers}`);
             } else if (text.includes('following') && !following) {
               following = extractNumber(li.textContent);
               console.log(`✅ Found following in li: ${following}`);
             } else if (text.includes('posts') && !posts) {
               posts = extractNumber(li.textContent);
               console.log(`✅ Found posts in li: ${posts}`);
             }
           });

           // Look for stats in spans
           const spans = document.querySelectorAll('span');
           spans.forEach(span => {
             const text = span.textContent.toLowerCase();
             if (text.includes('followers') && !followers) {
               followers = extractNumber(span.textContent);
               console.log(`✅ Found followers in span: ${followers}`);
             } else if (text.includes('following') && !following) {
               following = extractNumber(span.textContent);
               console.log(`✅ Found following in span: ${following}`);
             } else if (text.includes('posts') && !posts) {
               posts = extractNumber(span.textContent);
               console.log(`✅ Found posts in span: ${posts}`);
             }
           });
         }

         // Extract bio - comprehensive approach
         let bio = null;
         
         // Method 1: Look for bio in the main content area
         const mainSection = document.querySelector('main');
         if (mainSection) {
           console.log('🔍 Looking for bio in main section...');
           const allDivs = mainSection.querySelectorAll('div');
           for (const div of allDivs) {
             const text = div.textContent.trim();
             // Bio is usually a longer text that's not stats or UI elements
             if (text && 
                 text.length > 15 && 
                 text.length < 500 && 
                 !text.includes('followers') && 
                 !text.includes('following') && 
                 !text.includes('posts') &&
                 !text.includes('Follow') &&
                 !text.includes('Message') &&
                 !text.includes('Block') &&
                 !text.includes('Edit profile') &&
                 !/^\d+[KMB]?\s*(followers|following|posts)/i.test(text) &&
                 text !== username &&
                 !text.match(/^\d+$/) &&
                 !text.includes('Verified') &&
                 text.split(' ').length > 3) { // At least 4 words
               bio = text;
               console.log(`✅ Found bio (main section): "${bio}"`);
               break;
             }
           }
         }
         
         // Method 2: Look for bio in all text lines
         if (!bio) {
           console.log('🔍 Looking for bio in text lines...');
           for (const line of textLines) {
             if (line && 
                 line.length > 15 && 
                 line.length < 500 && 
                 !line.includes('followers') && 
                 !line.includes('following') && 
                 !line.includes('posts') &&
                 !line.includes('Follow') &&
                 !line.includes('Message') &&
                 !line.includes('Block') &&
                 !line.includes('Edit profile') &&
                 line !== username &&
                 !line.match(/^\d+$/) &&
                 !line.includes('Verified') &&
                 line.split(' ').length > 3) {
               bio = line;
               console.log(`✅ Found bio (text lines): "${bio}"`);
               break;
             }
           }
         }

         // Extract full name
         let fullName = null;
         
         // Try to find name in h1 or similar elements
         const h1Elements = document.querySelectorAll('h1');
         for (const h1 of h1Elements) {
           const text = h1.textContent.trim();
           if (text && text.length < 50 && text !== username) {
             fullName = text;
             console.log(`✅ Found full name: "${fullName}"`);
             break;
           }
         }

         // Extract profile picture URL
         const profilePic = getMetaContent('og:image');

         // Check if account is private
         const isPrivate = allText.includes('This Account is Private') || 
                          allText.includes('private account') ||
                          allText.includes('This account is private');

         // Check if verified
         const isVerified = !!document.querySelector('svg[aria-label="Verified"]') ||
                           !!document.querySelector('[data-testid="user-verified-badge"]') ||
                           allText.includes('Verified');

         console.log(`📊 Final stats - Followers: ${followers}, Following: ${following}, Posts: ${posts}, Bio: ${bio ? 'Found' : 'Not found'}`);

         return {
           username: username,
           fullName: fullName || `${username.charAt(0).toUpperCase()}${username.slice(1)}`,
           bio: bio,
           followersCount: followers,
           followingCount: following,
           postsCount: posts,
           profilePicUrl: profilePic || `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=200`,
           isPrivate: isPrivate,
           isVerified: isVerified,
           externalUrl: null,
           scrapedAt: new Date().toISOString()
         };
       }, username);

      await page.close();

      // Cache the data
      this.setCachedData(username, profileData);

      console.log(`✅ Successfully scraped @${username}:`, {
        followers: profileData.followersCount,
        following: profileData.followingCount,
        posts: profileData.postsCount
      });
      
      return profileData;

    } catch (error) {
      console.error(`❌ Error scraping @${username}:`, error.message);
      
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
    await this.closeBrowser();
    this.cache.clear();
  }
}

module.exports = new InstagramService(); 