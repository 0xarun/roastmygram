const request = require('request-promise');

const username = "0xarun";
const apiKey = "hfjuWLHaSagPZzWQ1aDAKtriG";
const apiEndPoint = "http://api.scraping-bot.io/scrape/data-scraper";
const auth = "Basic " + Buffer.from(username + ":" + apiKey).toString("base64");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function scrape() {
  try {
    console.log('🧪 Testing third-party Instagram scraper...\n');
    
    let response = await request({
      method: 'POST',
      url: apiEndPoint,
      json: {
        "scraper": "instagramProfile",
        "account": "0xarun",
        "posts_number": "12",
      },
      headers: {
        Accept: 'application/json',
        Authorization: auth
      },
    });
    
    console.log("📡 Response ID received:", response.responseId);
    
    let finalData;
    let attempts = 0;
    const maxAttempts = 12; // 1 minute max wait time
    
    do {
      // Wait 5 seconds between checks
      await sleep(5000);
      attempts++;
      
      console.log(`⏳ Checking for data... (attempt ${attempts}/${maxAttempts})`);
      
      let responseUrl = `http://api.scraping-bot.io/scrape/data-scraper-response?scraper=instagramProfile&responseId=${response.responseId}`;
      
      finalData = await request({
        method: 'GET',
        url: responseUrl,
        headers: {
          Accept: 'application/json',
          Authorization: auth
        },
        json: true
      });
      
      console.log("📊 Status:", finalData?.status || 'null');
      
      if (attempts >= maxAttempts) {
        console.log("⏰ Timeout reached, stopping...");
        break;
      }
      
    } while (finalData == null || finalData.status === "pending");
    
    return finalData;
    
  } catch (error) {
    console.error('❌ Error during scraping:', error.message);
    throw error;
  }
}

// Run the test
scrape()
  .then(result => {
    console.log('\n✅ Scraping completed!');
    console.log('📋 Final result:', JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
  });