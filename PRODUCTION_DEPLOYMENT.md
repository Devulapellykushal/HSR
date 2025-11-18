# Frontend Production Deployment Guide

## ⚠️ CRITICAL: Pre-Deployment Checklist

Before deploying the frontend to production, ensure you have completed ALL of the following:

### 1. Environment Variables

Create a `.env.local` file in the `hsr-fe` directory (or set environment variables in your hosting platform):

```env
# API Base URL (Backend)
# Development: http://localhost:8000/api
# Production: https://yourdomain.com/api
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

**Important Notes:**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never put secrets in `NEXT_PUBLIC_` variables
- The API URL must match your backend's `BASE_URL` setting
- Use HTTPS in production

### 2. Build the Application

```bash
# Install dependencies (if not already done)
bun install

# Create production build
bun run build

# Test the production build locally
bun run start
```

### 3. Verify Build Output

After building, check:
- ✅ No build errors or warnings
- ✅ `.next` directory is created
- ✅ Static assets are generated
- ✅ Build completes successfully

### 4. Image Domain Configuration

The `next.config.mjs` automatically configures image domains based on `NEXT_PUBLIC_API_BASE_URL`. 

**If you need to add additional image domains:**
1. Edit `next.config.mjs`
2. Add domains to the `domains` array
3. Add patterns to `remotePatterns` array
4. Rebuild the application

### 5. Security Headers

Security headers are automatically configured in `next.config.mjs`:
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy

These are applied automatically in production.

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. **Connect Repository:**
   - Push code to GitHub/GitLab/Bitbucket
   - Import project in Vercel
   - Connect your repository

2. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api`
   - Add any other required variables

3. **Deploy:**
   - Vercel automatically detects Next.js
   - Deploys on every push to main branch
   - Provides preview deployments for PRs

4. **Custom Domain:**
   - Add your domain in Project Settings → Domains
   - Configure DNS as instructed

### Option 2: Self-Hosted (Node.js Server)

1. **Build the Application:**
   ```bash
   bun run build
   ```

2. **Start Production Server:**
   ```bash
   bun run start
   ```
   Or use PM2 for process management:
   ```bash
   pm2 start npm --name "hsr-frontend" -- start
   ```

3. **Configure Reverse Proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name yourdomain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Option 3: Static Export (If Applicable)

If your app doesn't require server-side features:

1. **Update `next.config.mjs`:**
   ```javascript
   output: 'export',
   ```

2. **Build:**
   ```bash
   bun run build
   ```

3. **Deploy `out/` directory:**
   - Upload to any static hosting (Netlify, S3, etc.)

**Note:** Static export has limitations (no API routes, no ISR, etc.)

## Post-Deployment Verification

1. ✅ **Homepage loads correctly**
2. ✅ **API calls work** (check browser console for errors)
3. ✅ **Images load** (especially from backend)
4. ✅ **Admin login works**
5. ✅ **All pages are accessible**
6. ✅ **HTTPS is working** (no mixed content warnings)
7. ✅ **Security headers are present** (check with securityheaders.com)
8. ✅ **No console errors** (check browser console)

## Common Issues

### Issue: API calls failing with CORS errors
**Solution:** 
- Verify `NEXT_PUBLIC_API_BASE_URL` matches backend `BASE_URL`
- Check backend CORS settings include your frontend domain
- Ensure both are using HTTPS in production

### Issue: Images not loading
**Solution:**
- Verify image domain is in `next.config.mjs`
- Check that `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Ensure backend is serving images correctly
- Check browser console for specific errors

### Issue: 404 errors on page refresh
**Solution:**
- If using static export, this is expected (use client-side routing)
- If using server, ensure your hosting supports Next.js routing
- Configure server to redirect all routes to `index.html` (for static)

### Issue: Build fails
**Solution:**
- Check for TypeScript errors: `bun run lint`
- Verify all environment variables are set
- Check for missing dependencies
- Review build logs for specific errors

### Issue: Slow performance
**Solution:**
- Enable Next.js Image Optimization (already configured)
- Use CDN for static assets
- Enable compression (already configured)
- Check bundle size with `bun run build --analyze` (if configured)

## Performance Optimizations

The following are already configured:

- ✅ **React Strict Mode** - Catches potential problems
- ✅ **SWC Minification** - Faster builds and smaller bundles
- ✅ **Compression** - Gzip/Brotli compression
- ✅ **Image Optimization** - Automatic image optimization
- ✅ **Code Splitting** - Automatic code splitting by Next.js

### Additional Optimizations (Optional)

1. **Enable Analytics:**
   - Add Google Analytics or similar
   - Use environment variable: `NEXT_PUBLIC_GA_ID`

2. **Error Tracking:**
   - Integrate Sentry or similar
   - Update `ErrorBoundary.tsx` to send errors

3. **Caching:**
   - Configure CDN caching headers
   - Use Next.js ISR for static pages

## Environment-Specific Configuration

### Development
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Staging
```env
NEXT_PUBLIC_API_BASE_URL=https://staging.yourdomain.com/api
```

### Production
```env
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

## Monitoring

1. **Error Tracking:**
   - Set up error boundary (already added)
   - Integrate with error tracking service (Sentry, etc.)

2. **Analytics:**
   - Add analytics service
   - Monitor page views, user behavior

3. **Performance:**
   - Use Next.js Analytics (if using Vercel)
   - Monitor Core Web Vitals
   - Use Lighthouse for performance audits

## Security Best Practices

1. ✅ **HTTPS Only** - Always use HTTPS in production
2. ✅ **Security Headers** - Already configured in `next.config.mjs`
3. ✅ **Environment Variables** - Never commit `.env.local`
4. ✅ **Error Boundaries** - Already added to catch React errors
5. ✅ **Input Validation** - Validate all user inputs
6. ✅ **XSS Protection** - React automatically escapes, but be careful with `dangerouslySetInnerHTML`

## Console Statements

The codebase contains `console.error` and `console.warn` statements. In production:
- These are useful for debugging
- Consider wrapping in environment checks: `if (process.env.NODE_ENV === 'development')`
- Or integrate with logging service

## Support

If you encounter issues:
1. Check browser console for errors
2. Check network tab for failed requests
3. Verify environment variables are set
4. Check build logs
5. Verify backend is accessible from frontend domain

