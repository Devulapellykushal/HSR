# Frontend Deployment Guide for Render Backend

Since your backend is deployed on Render, here's what you need to configure in the frontend.

## 🎯 Quick Setup Steps

### 1. Get Your Render Backend URL

After deploying your backend on Render, you'll get a URL like:
- `https://your-app-name.onrender.com` (or your custom domain)

### 2. Configure Frontend Environment Variables

#### Option A: Local Development (`.env.local`)

Create `.env.local` in the `hsr-fe` directory:

```env
# Your Render backend URL + /api
NEXT_PUBLIC_API_BASE_URL=https://your-app-name.onrender.com/api
```

**Important:** 
- Use `https://` (Render provides HTTPS)
- Include `/api` at the end
- Example: `https://hsr-backend.onrender.com/api`

#### Option B: Production Deployment (Platform Settings)

When deploying frontend (Vercel, Netlify, etc.), set the environment variable:

**Variable Name:** `NEXT_PUBLIC_API_BASE_URL`  
**Value:** `https://your-app-name.onrender.com/api`

### 3. Update Backend CORS Settings

In your Render backend `.env` file, make sure:

```env
# Allow your frontend domain
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# If using Vercel preview deployments, you might need:
# CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://*.vercel.app
```

### 4. Update Backend BASE_URL

In your Render backend `.env`:

```env
# Your Render backend URL (without /api)
BASE_URL=https://your-app-name.onrender.com
```

## 📋 Complete Checklist

### Backend (Render) Configuration

- [ ] Backend deployed on Render
- [ ] Backend URL obtained (e.g., `https://your-app.onrender.com`)
- [ ] Environment variables set in Render:
  - [ ] `DEBUG=False`
  - [ ] `SECRET_KEY` (secure, generated)
  - [ ] `ALLOWED_HOSTS=your-app.onrender.com,your-custom-domain.com`
  - [ ] `BASE_URL=https://your-app.onrender.com`
  - [ ] `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com`
  - [ ] Database configured (PostgreSQL recommended)
  - [ ] Static files configured (if using Render's static file serving)

### Frontend Configuration

- [ ] `.env.local` created with `NEXT_PUBLIC_API_BASE_URL`
- [ ] API URL points to Render backend (with `/api` suffix)
- [ ] Test build locally: `bun run build`
- [ ] Test API connection locally
- [ ] Deploy frontend to hosting platform
- [ ] Set `NEXT_PUBLIC_API_BASE_URL` in hosting platform environment variables

## 🔧 Render-Specific Considerations

### 1. Render Backend URL Format

Render provides URLs in format: `https://<service-name>.onrender.com`

Your frontend should use:
```env
NEXT_PUBLIC_API_BASE_URL=https://<service-name>.onrender.com/api
```

### 2. Custom Domain on Render

If you set up a custom domain on Render:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

### 3. Render Free Tier Limitations

- **Cold starts:** Free tier services spin down after 15 minutes of inactivity
- **First request:** May take 30-60 seconds to wake up
- **Solution:** Consider upgrading to paid tier or use a service to ping your backend

### 4. CORS Configuration

Make sure your Render backend allows your frontend domain:

```env
# In Render backend .env
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com
```

If using Vercel for frontend with preview deployments:
```env
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://*.vercel.app
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend on Render

1. Connect your repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
5. Add environment variables (see backend checklist above)
6. Deploy

### Step 2: Configure Frontend

1. **Local Testing:**
   ```bash
   # Create .env.local
   echo "NEXT_PUBLIC_API_BASE_URL=https://your-app.onrender.com/api" > .env.local
   
   # Test build
   bun run build
   bun run start
   ```

2. **Deploy Frontend (Vercel recommended):**
   - Connect repository
   - Add environment variable: `NEXT_PUBLIC_API_BASE_URL`
   - Deploy

### Step 3: Verify Connection

1. Open browser console
2. Check for CORS errors
3. Test API calls
4. Verify images load from backend

## 🐛 Common Issues & Solutions

### Issue: CORS Errors

**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
1. Check `CORS_ALLOWED_ORIGINS` in backend `.env`
2. Include your frontend domain (with `https://`)
3. Restart backend service on Render

### Issue: 404 on API Calls

**Error:** `404 Not Found` when calling API

**Solution:**
1. Verify `NEXT_PUBLIC_API_BASE_URL` includes `/api` at the end
2. Check backend is running on Render
3. Verify API routes are correct

### Issue: Images Not Loading

**Error:** Images from backend don't load

**Solution:**
1. Check `next.config.mjs` - image domains should include your Render domain
2. Verify backend is serving media files correctly
3. Check browser console for specific errors

### Issue: Slow First Request

**Problem:** First API call takes 30-60 seconds

**Solution:**
- This is normal on Render free tier (cold start)
- Consider upgrading to paid tier
- Or use a service to keep backend warm

## 📝 Example Configuration

### Backend (Render) `.env`:
```env
DEBUG=False
SECRET_KEY=your-secure-secret-key-here
ALLOWED_HOSTS=your-app.onrender.com,yourdomain.com
BASE_URL=https://your-app.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
```

### Frontend `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-app.onrender.com/api
```

### Frontend (Vercel) Environment Variables:
```
NEXT_PUBLIC_API_BASE_URL = https://your-app.onrender.com/api
```

## ✅ Final Verification

After deployment, verify:

1. ✅ Frontend loads without errors
2. ✅ API calls work (check browser console)
3. ✅ Images from backend load correctly
4. ✅ Admin login works
5. ✅ No CORS errors in console
6. ✅ All pages are accessible

## 🆘 Need Help?

1. Check Render service logs for backend errors
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Test API endpoint directly: `https://your-app.onrender.com/api/ping/`

