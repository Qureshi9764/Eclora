# 🌐 Production URLs Configuration

## Deployed Applications

- **Backend API:** https://eclora.onrender.com
- **Frontend:** https://ecloramaison.vercel.app
- **Admin Panel:** https://eclora-admin.vercel.app

---

## ✅ Required Backend Environment Variables (Render)

You need to update your backend environment variables on Render to allow CORS from your deployed applications.

### Go to Render Dashboard:
1. Navigate to: https://dashboard.render.com/
2. Select your backend service
3. Click on "Environment" in the left sidebar
4. Update/Add these variables:

```env
CLIENT_URL=https://ecloramaison.vercel.app
ADMIN_URL=https://eclora-admin.vercel.app
NODE_ENV=production
```

### Important:
- ✅ **No trailing slashes** in URLs
- ✅ Must be **exact URLs** (including https://)
- ✅ After saving, Render will automatically redeploy

---

## 🔒 Backend CORS Configuration

Your backend is already configured to accept requests from these URLs. The CORS configuration in `backend/index.js` includes:

```javascript
const allowedOrigins = [
  'http://localhost:5173',           // Frontend dev
  'http://localhost:5174',           // Admin dev
  'http://localhost:3000',           // Alternative dev port
  process.env.CLIENT_URL,            // ✅ https://ecloramaison.vercel.app
  process.env.ADMIN_URL              // ✅ https://eclora-admin.vercel.app
].filter(Boolean);
```

Once you set the environment variables on Render, your deployed apps will be able to communicate with the backend.

---

## ✅ Verification Checklist

### Step 1: Update Render Backend Environment Variables
- [ ] Go to Render dashboard
- [ ] Select your backend service
- [ ] Go to Environment section
- [ ] Set `CLIENT_URL=https://ecloramaison.vercel.app`
- [ ] Set `ADMIN_URL=https://eclora-admin.vercel.app`
- [ ] Set `NODE_ENV=production` (if not already set)
- [ ] Save changes (backend will auto-redeploy)

### Step 2: Verify Frontend Environment Variable (Vercel)
- [ ] Go to Vercel dashboard → ecloramaison project
- [ ] Check Settings → Environment Variables
- [ ] Verify: `VITE_API_URL=https://eclora.onrender.com/api`
- [ ] If not set, add it and redeploy

### Step 3: Verify Admin Panel Environment Variable (Vercel)
- [ ] Go to Vercel dashboard → eclora-admin project
- [ ] Check Settings → Environment Variables
- [ ] Verify: `VITE_API_URL=https://eclora.onrender.com/api`
- [ ] If not set, add it and redeploy

### Step 4: Test the Connection
- [ ] Visit https://ecloramaison.vercel.app
- [ ] Open browser console (F12)
- [ ] Check for any CORS or network errors
- [ ] Try to fetch products or login
- [ ] Repeat for admin panel at https://eclora-admin.vercel.app

---

## 🧪 Testing Commands

### Test Backend API
```bash
curl https://eclora.onrender.com
# Should return: {"success":true,"message":"Eclora API is running","version":"1.0.0"}
```

### Test Frontend Connection
1. Visit: https://ecloramaison.vercel.app
2. Open DevTools Console (F12)
3. Check Network tab for API calls
4. Look for calls to `https://eclora.onrender.com/api/*`

### Test Admin Panel Connection
1. Visit: https://eclora-admin.vercel.app/login
2. Try to login
3. Check DevTools Console for errors
4. Verify API calls go to `https://eclora.onrender.com/api/*`

---

## 🔧 Troubleshooting

### Problem: "CORS Error" in browser console

**Solution:**
1. Verify backend environment variables are set correctly on Render
2. Make sure there are no trailing slashes in URLs
3. Wait for backend to finish redeploying after env var changes
4. Clear browser cache and reload

### Problem: "Network Error" or "Failed to fetch"

**Solution:**
1. Check if backend is running: Visit https://eclora.onrender.com
2. Check if `VITE_API_URL` is set in Vercel projects
3. Verify API URL has `/api` at the end: `https://eclora.onrender.com/api`

### Problem: Changes not reflecting

**Solution:**
1. After changing Render environment variables, wait for redeploy (2-3 minutes)
2. After changing Vercel environment variables, manually redeploy both projects
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📝 Quick Update Guide for Render

Since Render blocks terminal access, follow these steps:

1. **Login to Render:**
   - Go to: https://dashboard.render.com/

2. **Select Your Backend Service:**
   - Find and click on your Eclora backend service

3. **Update Environment Variables:**
   - Click "Environment" in the left sidebar
   - Find or add these variables:
     - `CLIENT_URL` → `https://ecloramaison.vercel.app`
     - `ADMIN_URL` → `https://eclora-admin.vercel.app`
     - `NODE_ENV` → `production`

4. **Save Changes:**
   - Click "Save Changes" button
   - Render will automatically redeploy your service
   - Wait 2-3 minutes for deployment to complete

5. **Verify:**
   - Check logs to ensure deployment succeeded
   - Visit https://eclora.onrender.com to verify it's running

---

## 🎯 Expected Results After Configuration

### ✅ Frontend (https://ecloramaison.vercel.app)
- Can fetch products from API
- Can register/login users
- Can add items to cart
- Can place orders
- Can contact via contact form
- No CORS errors in console

### ✅ Admin Panel (https://eclora-admin.vercel.app)
- Can login as admin
- Can manage products (CRUD)
- Can manage categories
- Can manage orders
- Can manage users
- Can upload images
- No CORS errors in console

### ✅ Backend (https://eclora.onrender.com)
- Accepts requests from frontend
- Accepts requests from admin panel
- Returns proper responses
- CORS configured correctly

---

## 📊 Current Configuration Summary

| Component | URL | Status |
|-----------|-----|--------|
| Backend | https://eclora.onrender.com | ✅ Deployed |
| Frontend | https://ecloramaison.vercel.app | ✅ Deployed |
| Admin Panel | https://eclora-admin.vercel.app | ✅ Deployed |
| CORS Config | Backend Environment Variables | ⏳ Needs Update |

---

## 🚀 Final Steps

1. **Update Render Backend** (3-5 minutes):
   - Set `CLIENT_URL` and `ADMIN_URL`
   - Wait for redeploy

2. **Verify Vercel Projects** (2 minutes):
   - Check both have `VITE_API_URL` set
   - Redeploy if needed

3. **Test Everything** (5 minutes):
   - Test frontend functionality
   - Test admin panel functionality
   - Check for errors

**Total time: ~10-15 minutes** ⏱️

---

**Once these environment variables are set, your entire application will be fully functional in production!** 🎉

