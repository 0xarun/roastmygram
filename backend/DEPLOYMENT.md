# 🚀 Deployment Guide

## Frontend (Vercel) + Backend (Render) Setup

### **Frontend Deployment (Vercel)**

1. **Connect to Vercel:**
   ```bash
   # In your frontend directory
   vercel --prod
   ```

2. **Environment Variables in Vercel:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
   ```

3. **Custom Domain Setup:**
   - Add `roastmygram.fun` in Vercel dashboard
   - Configure DNS records as instructed by Vercel

### **Backend Deployment (Render) - OPTIMIZED**

1. **Create New Web Service:**
   - Connect your GitHub repository
   - Select the `backend` folder
   - **Build Command:** `chmod +x render-build.sh && ./render-build.sh`
   - **Start Command:** `npm start`
   - **Environment:** Node 18.x

2. **Environment Variables in Render:**
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roastmygram
   PORT=10000
   BACKEND_URL=https://your-backend-name.onrender.com
   ```

3. **Auto-Deploy Settings:**
   - Enable auto-deploy from main branch
   - Set health check path: `/health`
   - **Instance Type:** Standard (for better performance)

### **Build Optimization Tips**

1. **Uses Instagram's Official API** instead of Puppeteer web scraping
2. **Much faster builds** - no Chromium download needed
3. **More reliable data** - direct API access
4. **Lightweight dependencies** - just axios for HTTP requests

### **Domain Configuration**

#### **Frontend (roastmygram.fun):**
- **Vercel Dashboard** → Domains → Add `roastmygram.fun`
- **DNS Records:**
  ```
  Type: A
  Name: @
  Value: 76.76.19.34
  ```

#### **Backend (Render URL):**
- Your backend will be available at: `https://your-backend-name.onrender.com`
- No custom domain needed for backend

### **Testing the Setup**

1. **Health Check:**
   ```bash
   curl https://your-backend-name.onrender.com/health
   ```

2. **Test Roast API:**
   ```bash
   curl -X POST https://your-backend-name.onrender.com/api/roasts \
     -H "Content-Type: application/json" \
     -d '{"username": "0xarun"}'
   ```

3. **Frontend Integration:**
   - Update your frontend API calls to use `NEXT_PUBLIC_API_URL`
   - Test the full flow from roastmygram.fun

### **Troubleshooting**

#### **CORS Issues:**
- Ensure `roastmygram.fun` is in the CORS origins
- Check that `NEXT_PUBLIC_API_URL` is correct in frontend

#### **Render Deployment Issues:**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

#### **MongoDB Connection:**
- Test MongoDB connection string locally first
- Ensure IP whitelist includes Render's IPs (0.0.0.0/0 for testing)

#### **Instagram API Issues:**
- Uses Instagram's official web API
- No authentication required for public profiles
- Fallback to mock data if API fails

### **Performance Optimization**

1. **Render Settings:**
   - Use "Standard" instance type for better performance
   - Enable "Always On" for faster cold starts

2. **MongoDB Atlas:**
   - Use M10 or higher cluster for production
   - Enable connection pooling

3. **Caching:**
   - Backend includes 1-hour cache for Instagram data
   - Consider Redis for additional caching if needed

### **Monitoring**

1. **Render Dashboard:**
   - Monitor request logs
   - Check response times
   - Set up alerts for errors

2. **Vercel Analytics:**
   - Enable Vercel Analytics for frontend monitoring
   - Track user interactions and performance

### **Security Checklist**

- ✅ CORS configured for roastmygram.fun only
- ✅ Rate limiting enabled (100 req/15min)
- ✅ Helmet.js security headers
- ✅ Environment variables secured
- ✅ MongoDB connection string protected
- ✅ Input validation on all endpoints 