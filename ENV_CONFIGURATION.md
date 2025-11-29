# 🔧 Environment Configuration Guide

## Overview

The application now **requires** environment variables to be set in `.env` files. Hardcoded fallback URLs have been removed to ensure all configurations come from environment variables.

---

## 📁 Required .env Files

### 1. Frontend `.env` File

**Location:** `frontend/.env`

**Required Variables:**
```env
VITE_API_URL=https://eclora-sj6w.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 2. Admin Panel `.env` File

**Location:** `admin-panel/.env`

**Required Variables:**
```env
VITE_API_URL=https://eclora-sj6w.onrender.com/api
```

### 3. Backend `.env` File

**Location:** `backend/.env`

**Required Variables:**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/eclora
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=https://ecloramaison.vercel.app
ADMIN_URL=https://eclora-admin.vercel.app
NODE_ENV=production
```

---

## ⚠️ Important Notes

### For Development

1. **Create `.env` files** in each directory (frontend, admin-panel, backend)
2. **Copy the example** configurations above
3. **Fill in your actual values** for each variable
4. **Never commit** `.env` files to git (they're in .gitignore)

### For Production (Vercel/Render)

1. **Frontend (Vercel):**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL=https://eclora-sj6w.onrender.com/api`
   - Add: `VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key`

2. **Admin Panel (Vercel):**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL=https://eclora-sj6w.onrender.com/api`

3. **Backend (Render):**
   - Go to Environment tab
   - Add all required variables from the backend section above

---

## 🔒 Error Handling

The application will now **throw an error** if `VITE_API_URL` is not set:

- **Frontend:** Application will fail to start with a clear error message
- **Admin Panel:** Application will fail to start with a clear error message
- **Admin Panel Pages:** Will show toast error if API URL is missing when uploading images

### Error Messages

- `VITE_API_URL environment variable is not defined. Please set it in your .env file.`
- `API URL is not configured. Please set VITE_API_URL in your .env file.`

---

## ✅ Verification Steps

### Local Development

1. **Check if .env files exist:**
   ```bash
   # Frontend
   ls frontend/.env
   
   # Admin Panel
   ls admin-panel/.env
   
   # Backend
   ls backend/.env
   ```

2. **Verify variables are set:**
   ```bash
   # In frontend directory
   cat .env | grep VITE_API_URL
   
   # Should show:
   # VITE_API_URL=https://eclora-sj6w.onrender.com/api
   ```

3. **Start the application:**
   ```bash
   # Frontend
   cd frontend && npm run dev
   
   # Admin Panel
   cd admin-panel && npm run dev
   ```

### Production (Vercel)

1. **Check Environment Variables:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Verify `VITE_API_URL` is set correctly

2. **Redeploy if needed:**
   - After updating environment variables, redeploy your project
   - Check deployment logs for any errors

---

## 📝 Changes Made

### Files Updated

1. ✅ `frontend/src/services/api.js`
   - Removed hardcoded fallback URL
   - Added error handling for missing env variable

2. ✅ `admin-panel/src/services/api.js`
   - Removed hardcoded fallback URL
   - Added error handling for missing env variable

3. ✅ `admin-panel/src/pages/Categories.jsx`
   - Removed hardcoded fallback URL
   - Added validation and error message

4. ✅ `admin-panel/src/pages/Banners.jsx`
   - Removed hardcoded fallback URL
   - Added validation and error message

5. ✅ `admin-panel/src/pages/ProductForm.jsx`
   - Removed hardcoded fallback URL
   - Added validation and error message

---

## 🚀 Quick Setup

### 1. Create Frontend .env
```bash
cd frontend
cat > .env << EOF
VITE_API_URL=https://eclora-sj6w.onrender.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
EOF
```

### 2. Create Admin Panel .env
```bash
cd admin-panel
cat > .env << EOF
VITE_API_URL=https://eclora-sj6w.onrender.com/api
EOF
```

### 3. Create Backend .env
```bash
cd backend
cat > .env << EOF
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=https://ecloramaison.vercel.app
ADMIN_URL=https://eclora-admin.vercel.app
NODE_ENV=production
EOF
```

---

## 🎯 Benefits

✅ **Explicit Configuration:** No hidden defaults or fallbacks  
✅ **Better Error Messages:** Clear errors if configuration is missing  
✅ **Environment-Specific:** Easy to switch between dev/staging/production  
✅ **Security:** Sensitive values stay in .env files, not in code  
✅ **Deployment Flexibility:** Different URLs for different environments  

---

## ❓ Troubleshooting

### Error: "VITE_API_URL environment variable is not defined"

**Solution:**
1. Create a `.env` file in your project directory
2. Add `VITE_API_URL=https://eclora-sj6w.onrender.com/api`
3. Restart your development server

### Error: "API URL is not configured"

**Solution:**
1. Check if `.env` file exists
2. Verify `VITE_API_URL` is set correctly
3. Make sure there are no typos in variable name
4. Restart the development server

### Environment Variable Not Loading

**Solution:**
1. Ensure `.env` file is in the correct directory (frontend/ or admin-panel/)
2. Variable names must start with `VITE_` for Vite projects
3. Restart the development server after creating/modifying `.env`
4. Clear browser cache if using in production

---

**Last Updated:** All hardcoded fallbacks removed, environment variables are now required! 🔒

