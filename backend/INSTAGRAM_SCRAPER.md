# Instagram Profile Scraper

A complete Instagram profile scraper built with Node.js and Express that works on Render.com. This scraper uses simple HTTP requests to extract profile data, posts, and engagement metrics from Instagram profiles.

## Features

- ✅ **Profile Data Extraction**: Username, full name, biography, profile picture
- ✅ **Follower Analytics**: Follower count, following count, engagement rate
- ✅ **Post Analysis**: Recent posts with likes, comments, hashtags, mentions
- ✅ **Business Account Detection**: Verified status, business account info
- ✅ **Batch Processing**: Scrape multiple profiles in one request
- ✅ **Rate Limiting**: Built-in protection against Instagram rate limits
- ✅ **Proxy Support**: Optional proxy configuration for better reliability
- ✅ **MongoDB Storage**: Cache scraped data for analysis
- ✅ **Render.com Ready**: Optimized for cloud deployment

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables in `.env`:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/roastmygram

# Optional: Proxy for better scraping
HTTPS_PROXY=http://your-proxy-server:port

# Environment
NODE_ENV=production
PORT=5000
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### 1. Scrape Single Profile
```http
GET /api/instagram/scrape/:username
```

**Example:**
```bash
curl https://your-api.onrender.com/api/instagram/scrape/instagram
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "username": "instagram",
      "fullName": "Instagram",
      "biography": "Bringing you closer to the people and things you love.",
      "profilePicUrl": "https://...",
      "followersCount": 500000000,
      "followingCount": 0,
      "postsCount": 1000,
      "isVerified": true,
      "isPrivate": false,
      "recentPosts": [...],
      "scrapedAt": "2024-01-15T10:30:00.000Z"
    },
    "stats": {
      "username": "instagram",
      "followers": 500000000,
      "following": 0,
      "posts": 1000,
      "engagementRate": "2.5",
      "averageLikes": 12500000,
      "averageComments": 50000,
      "isPrivate": false,
      "isVerified": true,
      "isBusiness": true
    }
  }
}
```

### 2. Batch Scrape Multiple Profiles
```http
POST /api/instagram/batch
```

**Request Body:**
```json
{
  "usernames": ["instagram", "cristiano", "leomessi"],
  "delay": 2000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "username": "instagram",
        "success": true,
        "data": {...}
      },
      {
        "username": "cristiano",
        "success": true,
        "data": {...}
      }
    ],
    "summary": {
      "total": 3,
      "successful": 3,
      "failed": 0,
      "successRate": "100.0"
    }
  }
}
```

### 3. Get Profile Statistics Only
```http
GET /api/instagram/stats/:username
```

### 4. Health Check
```http
GET /api/instagram/health
```

### 5. Scraper Information
```http
GET /api/instagram/info
```

## Rate Limiting

- **Single Profile Scraping**: 30 requests per 15 minutes per IP
- **Batch Scraping**: 5 requests per 15 minutes per IP
- **Automatic Delays**: 2-second delay between requests in batch mode

## Data Extracted

### Profile Information
- Username and full name
- Biography and external URL
- Profile picture (standard and HD)
- Verification status
- Business account information
- Privacy settings

### Analytics
- Follower and following counts
- Total posts count
- Engagement rate calculation
- Average likes and comments
- Follower-to-following ratio

### Recent Posts (up to 12)
- Post ID and shortcode
- Image/video URLs
- Caption text
- Like and comment counts
- Post timestamp
- Location information
- Extracted hashtags and mentions

### Highlights/Stories
- Highlight reel information
- Cover media URLs
- Media counts

## Error Handling

The scraper handles various error scenarios:

- **404**: Profile not found
- **503**: Instagram service unavailable
- **422**: Unable to extract data
- **429**: Rate limited by Instagram
- **500**: Internal server error

## Deployment on Render.com

1. **Create a new Web Service** on Render.com
2. **Connect your GitHub repository**
3. **Configure the service:**
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node.js

4. **Set Environment Variables:**
   ```
   MONGODB_URI=your-mongodb-connection-string
   NODE_ENV=production
   PORT=10000
   ```

5. **Optional: Add Proxy** (for better reliability):
   ```
   HTTPS_PROXY=your-proxy-url
   ```

## Usage Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

// Scrape single profile
const response = await axios.get('https://your-api.onrender.com/api/instagram/scrape/instagram');
console.log(response.data);

// Batch scrape
const batchResponse = await axios.post('https://your-api.onrender.com/api/instagram/batch', {
  usernames: ['instagram', 'cristiano', 'leomessi'],
  delay: 2000
});
console.log(batchResponse.data);
```

### Python
```python
import requests

# Scrape single profile
response = requests.get('https://your-api.onrender.com/api/instagram/scrape/instagram')
data = response.json()
print(data)

# Batch scrape
batch_data = {
    'usernames': ['instagram', 'cristiano', 'leomessi'],
    'delay': 2000
}
batch_response = requests.post('https://your-api.onrender.com/api/instagram/batch', json=batch_data)
print(batch_response.json())
```

### cURL
```bash
# Single profile
curl https://your-api.onrender.com/api/instagram/scrape/instagram

# Batch scrape
curl -X POST https://your-api.onrender.com/api/instagram/batch \
  -H "Content-Type: application/json" \
  -d '{"usernames": ["instagram", "cristiano"], "delay": 2000}'
```

## Best Practices

1. **Respect Rate Limits**: Don't exceed the built-in rate limits
2. **Use Batch Processing**: For multiple profiles, use the batch endpoint
3. **Handle Errors**: Always check for error responses
4. **Cache Data**: Store scraped data to avoid repeated requests
5. **Monitor Usage**: Track your API usage and success rates

## Limitations

- **Public Profiles Only**: Cannot scrape private profiles
- **Recent Posts**: Limited to the most recent 12 posts
- **Rate Limits**: Subject to Instagram's rate limiting
- **Data Accuracy**: Depends on Instagram's page structure

## Troubleshooting

### Common Issues

1. **Profile Not Found (404)**
   - Check if the username is correct
   - Verify the profile is public
   - Try again later if the profile was recently created

2. **Rate Limited (429)**
   - Wait before making more requests
   - Use longer delays between requests
   - Consider using a proxy

3. **Data Extraction Failed (422)**
   - Instagram may have changed their page structure
   - Try again later
   - Check the scraper logs for details

4. **Service Unavailable (503)**
   - Instagram may be experiencing issues
   - Try again in a few minutes
   - Check Instagram's status

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide detailed error messages and request logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Test with the health check endpoint
4. Check the server logs for detailed error information 