# 🛠️ Development Setup Guide

## Quick Start for Local Development

### 1. **Install Dependencies**
```bash
cd backend
npm install
```

**Note:** This will install both production and development dependencies:
- `puppeteer-core` + `chrome-aws-lambda` (for production)
- `puppeteer` (for development - includes Chromium)

### 2. **Create Environment File**
Create a `.env` file in the backend directory:
```env
# Development Environment
NODE_ENV=development
PORT=5000

# Local MongoDB (if you have it installed)
MONGODB_URI=mongodb://localhost:27017/roastmygram

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache timeout
CACHE_TIMEOUT=3600000

# Security
ENABLE_HELMET=true
ENABLE_CORS=true

# Logging
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

### 3. **Start Development Server**
```bash
npm run dev
```

### 4. **Test the API**
```bash
# Health check
curl http://localhost:5000/health

# Test roast endpoint
curl -X POST http://localhost:5000/api/roasts \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

## 🔧 How It Works

### **Development Mode (Windows/Linux/Mac):**
- Uses `puppeteer` (includes Chromium download)
- Works on all platforms
- Slower initial setup but reliable

### **Production Mode (Render.com):**
- Uses `puppeteer-core` + `chrome-aws-lambda`
- No Chromium download needed
- Faster builds on Render.com

## 🧪 Testing Checklist

- [ ] All dependencies load without errors
- [ ] Server starts on port 5000
- [ ] Health endpoint responds
- [ ] Instagram service works with puppeteer
- [ ] CORS allows frontend requests
- [ ] Rate limiting works
- [ ] Error handling works

## 🚀 Ready for Production

Once local testing passes:
1. Commit your changes
2. Push to GitHub
3. Update Render.com with new build command: `chmod +x render-build.sh && ./render-build.sh`
4. Deploy and enjoy faster builds! 🎉

## 🔍 Troubleshooting

### **Chrome/Chromium Issues:**
- Development: Uses bundled Chromium (no setup needed)
- Production: Uses system Chrome on Render.com

### **Build Issues:**
- Make sure `NODE_ENV=development` for local testing
- Production builds use optimized dependencies 