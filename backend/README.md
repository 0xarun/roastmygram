# Roast My Insta - Backend API

🔥 Express.js backend for the Instagram profile roasting application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup

1. **Copy the example file:**
   ```bash
   cp example.env .env
   ```

2. **Edit `.env` with your values:**

   **Development:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/roastmygram
   FRONTEND_URL=http://localhost:3000
   ```

   **Production (Render):**
   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roastmygram
   FRONTEND_URL=https://roastmygram.fun
   BACKEND_URL=https://your-backend-name.onrender.com
   ```

### 3. MongoDB Setup
The application will automatically create the necessary collections and indexes when it first runs. No manual setup required!

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### 🔥 Roast a Profile
**POST** `/api/roasts`

**Request Body:**
```json
{
  "username": "instagram_username"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "instagram_username",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "profile": {
      "username": "instagram_username",
      "fullName": "Full Name",
      "bio": "Bio text",
      "followersCount": 1000,
      "followingCount": 500,
      "postsCount": 50,
      "profilePicUrl": "https://...",
      "isPrivate": false,
      "isVerified": false,
      "scrapedAt": "2024-01-01T00:00:00Z"
    },
    "roast": {
      "id": "uuid",
      "text": "Your roast text here 🔥",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "stats": {
      "userRoastCount": 5,
      "totalUsers": 1000,
      "totalRoasts": 5000
    },
    "recentRoasts": [...]
  },
  "message": "🔥 Successfully roasted @username!"
}
```

### 📊 Get Statistics
**GET** `/api/roasts/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1000,
    "totalRoasts": 5000
  },
  "message": "📊 Statistics retrieved successfully"
}
```

### 📝 Get User Roasts
**GET** `/api/roasts/user/:username`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "username",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "roastCount": 5,
    "roasts": [...]
  },
  "message": "📝 Found 5 roasts for @username"
}
```

### 🏥 Health Check
**GET** `/api/roasts/health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "stats": {
    "totalUsers": 1000,
    "totalRoasts": 5000
  },
  "message": "🔥 Roast My Insta API is running smoothly!"
}
```

## 🏗️ Architecture

```
backend/
├── src/
│   ├── controllers/
│   │   └── roastController.js    # Main business logic
│   ├── services/
│   │   ├── instagramService.js   # Instagram scraping
│   │   └── databaseService.js    # Database operations
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Roast.js             # Roast model
│   ├── routes/
│   │   └── roasts.js             # API routes
│   ├── middleware/               # Custom middleware
│   └── utils/                    # Utility functions
├── server.js                     # Main server file
└── package.json
```

## 🔧 Features

- ✅ **Fast Instagram Scraping** - Using Puppeteer with caching
- ✅ **MongoDB Integration** - Flexible NoSQL database
- ✅ **Minimal Database Schema** - Only essential data stored
- ✅ **Profile Picture URLs** - Direct Instagram URLs, no storage needed
- ✅ **Rate Limiting** - Built-in protection against abuse
- ✅ **Error Handling** - Graceful fallbacks and error responses
- ✅ **Caching** - 1-hour cache for scraped data
- ✅ **Health Monitoring** - Built-in health check endpoint

## 🚀 Performance

- **Scraping Speed**: 2-3 seconds for new profiles
- **Cached Requests**: <100ms for cached data
- **Concurrent Users**: 10-20 simultaneous requests
- **Database**: Fast MongoDB with proper indexing

## 🔒 Security

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Username sanitization and validation
- **CORS Protection**: Configured for frontend domain
- **Helmet.js**: Security headers and protection

## 🐛 Troubleshooting

### Common Issues:

1. **Puppeteer Installation**: If you get Puppeteer errors, try:
   ```bash
   npm rebuild puppeteer
   ```

2. **MongoDB Connection**: Ensure your MongoDB URI is correct

3. **Instagram Blocking**: The scraper includes anti-detection measures, but Instagram may still block requests. In that case, the API will return fallback data.

## 📝 License

ISC License 