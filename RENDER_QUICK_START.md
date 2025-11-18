# 🚀 Quick Start: Frontend Setup for Render Backend

## Step 1: Get Your Render Backend URL

After deploying on Render, you'll have a URL like:
```
https://your-app-name.onrender.com
```

## Step 2: Set Frontend Environment Variable

### For Local Development:

Create `.env.local` in `hsr-fe` directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-app-name.onrender.com/api
```

**Important:** 
- ✅ Use `https://` (Render provides HTTPS)
- ✅ Add `/api` at the end
- ✅ Replace `your-app-name` with your actual Render service name

### For Production Deployment (Vercel/Netlify/etc.):

Add this environment variable in your hosting platform:
- **Name:** `NEXT_PUBLIC_API_BASE_URL`
- **Value:** `https://your-app-name.onrender.com/api`

## Step 3: Update Backend CORS (In Render Dashboard)

In your Render backend service, add/update environment variable:

```
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

If using Vercel, you might need:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

## Step 4: Test Locally

```bash
cd hsr-fe
bun install
bun run build
bun run start
```

Visit `http://localhost:3000` and check browser console for any errors.

## Step 5: Deploy Frontend

Deploy to your chosen platform (Vercel recommended for Next.js).

## ✅ That's It!

Your frontend will now connect to your Render backend.

---

**Need more details?** See `RENDER_DEPLOYMENT.md` for complete guide.

