# 🚨 FRONTEND PRODUCTION DEPLOYMENT CHECKLIST

## BEFORE DEPLOYING - Complete These Steps:

### ✅ Environment Variables
- [ ] Create `.env.local` file (or set in hosting platform)
- [ ] Set `NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api` (NOT localhost!)
- [ ] Verify API URL matches backend `BASE_URL`

### ✅ Build & Test
- [ ] Run `bun install` to ensure dependencies are installed
- [ ] Run `bun run build` - verify no errors
- [ ] Test production build locally: `bun run start`
- [ ] Verify all pages load correctly
- [ ] Test admin login functionality

### ✅ Configuration
- [ ] Verify `next.config.mjs` has production settings
- [ ] Check image domains are configured correctly
- [ ] Verify security headers are enabled

### ✅ Backend Integration
- [ ] Backend is deployed and accessible
- [ ] Backend CORS includes your frontend domain
- [ ] Backend `BASE_URL` matches frontend `NEXT_PUBLIC_API_BASE_URL`
- [ ] Test API calls from frontend

### ✅ Deployment Platform Setup
- [ ] Choose deployment platform (Vercel, self-hosted, etc.)
- [ ] Configure environment variables in platform
- [ ] Set up custom domain (if applicable)
- [ ] Configure SSL/HTTPS certificate

### ✅ Post-Deployment Testing
- [ ] Homepage loads
- [ ] All pages are accessible
- [ ] Images load correctly
- [ ] API calls work (check browser console)
- [ ] Admin login works
- [ ] No console errors
- [ ] HTTPS is working
- [ ] Security headers are present

## ⚠️ CRITICAL WARNINGS

1. **NEVER commit `.env.local`** - It contains sensitive URLs
2. **ALWAYS use HTTPS in production** - Never use HTTP
3. **VERIFY API URL** - Must match backend `BASE_URL`
4. **TEST before deploying** - Always test production build locally first

## Quick Commands

```bash
# Install dependencies
bun install

# Build for production
bun run build

# Test production build locally
bun run start

# Lint code
bun run lint
```

## Environment Variables Template

Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

## Need Help?

See `PRODUCTION_DEPLOYMENT.md` for detailed instructions.

