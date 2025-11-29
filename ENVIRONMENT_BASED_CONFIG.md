# 🔧 Environment-Based API Configuration

## Overview

The application now automatically selects the correct API URL based on the environment:
- **Development (localhost):** Uses `http://localhost:5000/api`
- **Production (deployed):** Uses `https://eclora-sj6w.onrender.com/api`

You can still override this by setting `VITE_API_URL` in your `.env` file.

---

## 🎯 How It Works

### Priority Order:

1. **Highest Priority:** `VITE_API_URL` from `.env` file (if set)
2. **Development Mode:** Automatically uses `http://localhost:5000/api`
3. **Production Mode:** Automatically uses `https://eclora-sj6w.onrender.com/api`

### Detection Method:

The application uses Vite's built-in environment detection:
- `import.meta.env.DEV` - `true` in development mode
- `import.meta.env.PROD` - `true` in production mode

---

## 📝 Configuration

### Option 1: Automatic (Recommended)

**No `.env` file needed!** The application will automatically:
- Use `http://localhost:5000/api` when running locally (`npm run dev`)
- Use `https://eclora-sj6w.onrender.com/api` when deployed to production

### Option 2: Override with .env File

If you want to override the default behavior, create a `.env` file:

#### Frontend `.env`:
```env
# Override default - use this URL instead of auto-detection
VITE_API_URL=http://localhost:5000/api

# For production deployment on Vercel, set:
# VITE_API_URL=https://eclora-sj6w.onrender.com/api

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### Admin Panel `.env`:
```env
# Override default - use this URL instead of auto-detection
VITE_API_URL=http://localhost:5000/api

# For production deployment on Vercel, set:
# VITE_API_URL=https://eclora-sj6w.onrender.com/api
```

---

## 🚀 Development Workflow

### Local Development (No .env needed)

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   # Backend runs on http://localhost:5000
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Frontend automatically uses http://localhost:5000/api
   ```

3. **Start Admin Panel:**
   ```bash
   cd admin-panel
   npm run dev
   # Admin panel automatically uses http://localhost:5000/api
   ```

**That's it!** No configuration needed. The app automatically detects it's in development mode and uses localhost.

---

## 🌐 Production Deployment

### Vercel Deployment

#### Option A: Automatic (No env vars needed)

The application will automatically use `https://eclora-sj6w.onrender.com/api` in production mode.

#### Option B: Explicit Configuration (Recommended for production)

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   ```
   VITE_API_URL=https://eclora-sj6w.onrender.com/api
   ```
5. Redeploy your application

---

## 📋 Environment Detection Logic

### Frontend (`frontend/src/services/api.js`):
```javascript
const getApiUrl = () => {
  // Priority 1: Check if VITE_API_URL is set in .env
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Priority 2: Development mode → localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  
  // Priority 3: Production mode → Render backend
  return 'https://eclora-sj6w.onrender.com/api';
};
```

### Admin Panel (same logic):
- Uses shared utility: `admin-panel/src/utils/apiConfig.js`
- Same priority order as frontend

---

## ✅ Verification

### Check Current API URL

You can verify which URL is being used:

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Type:**
   ```javascript
   console.log(import.meta.env.MODE); // 'development' or 'production'
   console.log(import.meta.env.DEV);  // true or false
   console.log(import.meta.env.VITE_API_URL); // Your .env value or undefined
   ```

### Expected Behavior:

#### Local Development:
```
MODE: 'development'
DEV: true
VITE_API_URL: undefined (if no .env file)
→ Uses: http://localhost:5000/api
```

#### Production (Vercel):
```
MODE: 'production'
DEV: false
VITE_API_URL: undefined (if not set in Vercel)
→ Uses: https://eclora-sj6w.onrender.com/api
```

#### With .env Override:
```
MODE: 'development' or 'production'
DEV: true or false
VITE_API_URL: 'http://localhost:5000/api' (from .env)
→ Uses: http://localhost:5000/api (respects .env)
```

---

## 🎯 Use Cases

### Use Case 1: Pure Local Development
- ✅ No `.env` file needed
- ✅ Automatically uses `http://localhost:5000/api`
- ✅ Just run `npm run dev`

### Use Case 2: Testing Production API Locally
Create `frontend/.env`:
```env
VITE_API_URL=https://eclora-sj6w.onrender.com/api
```
- Now your local frontend will connect to production backend
- Useful for testing production API without deploying

### Use Case 3: Custom Backend URL
Create `frontend/.env`:
```env
VITE_API_URL=http://192.168.1.100:5000/api
```
- Use your custom backend URL
- Overrides automatic detection

### Use Case 4: Production Deployment
- ✅ No configuration needed (auto-detects production)
- ✅ Or explicitly set in Vercel: `VITE_API_URL=https://eclora-sj6w.onrender.com/api`

---

## 📁 Files Updated

### Core Implementation:
- ✅ `frontend/src/services/api.js` - Environment-based URL detection
- ✅ `admin-panel/src/services/api.js` - Environment-based URL detection
- ✅ `admin-panel/src/utils/apiConfig.js` - Shared utility function

### Admin Panel Pages (using utility):
- ✅ `admin-panel/src/pages/Categories.jsx`
- ✅ `admin-panel/src/pages/Banners.jsx`
- ✅ `admin-panel/src/pages/ProductForm.jsx`

---

## 🔍 Troubleshooting

### Problem: Still connecting to localhost in production

**Solution:**
1. Check Vercel environment variables
2. Make sure `NODE_ENV` is set to `production` in Vercel
3. Verify the build mode is production
4. Clear Vercel build cache and redeploy

### Problem: Want to use production API locally

**Solution:**
Create `.env` file:
```env
VITE_API_URL=https://eclora-sj6w.onrender.com/api
```
Restart dev server.

### Problem: API URL is wrong

**Solution:**
1. Check which environment you're in:
   ```javascript
   console.log('Mode:', import.meta.env.MODE);
   console.log('DEV:', import.meta.env.DEV);
   console.log('API URL from env:', import.meta.env.VITE_API_URL);
   ```
2. If `.env` exists, check the value
3. Restart development server after changing `.env`

---

## 💡 Benefits

✅ **Zero Configuration:** Works out of the box for development  
✅ **Flexible:** Can override with `.env` when needed  
✅ **Environment-Aware:** Automatically uses correct URL  
✅ **Developer Friendly:** No hardcoded URLs in code  
✅ **Production Ready:** Works seamlessly when deployed  

---

## 📊 Summary

| Environment | Default API URL | Can Override? |
|-------------|----------------|---------------|
| Development (localhost) | `http://localhost:5000/api` | ✅ Yes (via .env) |
| Production (Vercel) | `https://eclora-sj6w.onrender.com/api` | ✅ Yes (via Vercel env vars) |

**Best Practice:**
- Development: Don't create `.env` file (use auto-detection)
- Production: Optionally set `VITE_API_URL` in Vercel for explicit control

---

**Last Updated:** Environment-based API URL detection implemented! 🎉

