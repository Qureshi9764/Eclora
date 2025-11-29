# 🚀 Vercel Deployment Guide - API URL Configuration

## Quick Answer

**Yes, it will automatically use your production URL (`https://eclora-sj6w.onrender.com/api`) when deployed to Vercel, WITHOUT any configuration!**

However, **it's recommended** to explicitly set it in Vercel environment variables for better control and clarity.

---

## 🎯 How It Works

### Automatic Detection (No Config Needed)

When you deploy to Vercel:

1. ✅ Vercel automatically builds in **production mode**
2. ✅ `import.meta.env.DEV` will be `false`
3. ✅ Your code automatically uses: `https://eclora-sj6w.onrender.com/api`

**Result:** It works out of the box! No configuration needed.

---

## ✅ Recommended: Explicit Configuration (Optional but Better)

Even though it works automatically, we recommend setting it explicitly in Vercel for:

- ✅ **Clarity:** Everyone knows which API is being used
- ✅ **Control:** Easy to change if needed
- ✅ **Debugging:** Easier to verify configuration
- ✅ **Best Practice:** Explicit is better than implicit

---

## 📝 Step-by-Step: Setting Environment Variables in Vercel

### For Frontend Project

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Login to your account

2. **Select Your Frontend Project:**
   - Find and click on your frontend project (e.g., `ecloramaison`)

3. **Navigate to Settings:**
   - Click on **"Settings"** tab at the top
   - In the left sidebar, click **"Environment Variables"**

4. **Add Environment Variable:**
   - Click **"Add New"** button
   - **Key:** `VITE_API_URL`
   - **Value:** `https://eclora-sj6w.onrender.com/api`
   - **Environment:** Select **"Production"** (and optionally Preview/Development)
   - Click **"Save"**

5. **Add Stripe Key (if needed):**
   - Click **"Add New"** again
   - **Key:** `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Value:** Your Stripe publishable key
   - **Environment:** Select **"Production"**
   - Click **"Save"**

6. **Redeploy:**
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger redeploy

### For Admin Panel Project

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard

2. **Select Your Admin Panel Project:**
   - Find and click on your admin panel project (e.g., `eclora-admin`)

3. **Navigate to Settings:**
   - Click on **"Settings"** tab
   - Click **"Environment Variables"** in left sidebar

4. **Add Environment Variable:**
   - Click **"Add New"**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://eclora-sj6w.onrender.com/api`
   - **Environment:** Select **"Production"**
   - Click **"Save"**

5. **Redeploy:**
   - Go to **"Deployments"** tab
   - Redeploy the latest deployment

---

## 🔍 Verification Steps

### After Deployment

1. **Visit Your Deployed Frontend:**
   - Open: https://ecloramaison.vercel.app (or your URL)
   - Open browser DevTools (F12)
   - Go to **Console** tab

2. **Check Which URL is Being Used:**
   Type this in the console:
   ```javascript
   console.log('Mode:', import.meta.env.MODE);
   console.log('DEV:', import.meta.env.DEV);
   console.log('API URL:', import.meta.env.VITE_API_URL || 'Auto-detected');
   ```

3. **Expected Results:**

   **If NOT set in Vercel (automatic):**
   ```
   Mode: production
   DEV: false
   API URL: Auto-detected
   → Using: https://eclora-sj6w.onrender.com/api ✅
   ```

   **If SET in Vercel (explicit):**
   ```
   Mode: production
   DEV: false
   API URL: https://eclora-sj6w.onrender.com/api
   → Using: https://eclora-sj6w.onrender.com/api ✅
   ```

4. **Check Network Requests:**
   - Open **Network** tab in DevTools
   - Navigate around your site
   - Look for API calls - they should go to `https://eclora-sj6w.onrender.com/api/*`

---

## 📊 Comparison: Automatic vs Explicit

| Approach | Configuration Needed? | Pros | Cons |
|----------|---------------------|------|------|
| **Automatic** | ❌ No | Zero setup, works immediately | Less explicit, harder to debug |
| **Explicit (Recommended)** | ✅ Yes (5 minutes) | Clear configuration, easy to change | Requires setup |

**Our Recommendation:** Use **Explicit Configuration** for production deployments.

---

## 🎯 Summary

### Option 1: Automatic (Works but not recommended)
- ✅ Deploy to Vercel
- ✅ It automatically uses `https://eclora-sj6w.onrender.com/api`
- ✅ No configuration needed
- ⚠️ Less clear which API is being used

### Option 2: Explicit (Recommended)
- ✅ Set `VITE_API_URL=https://eclora-sj6w.onrender.com/api` in Vercel
- ✅ Redeploy
- ✅ Explicit and clear configuration
- ✅ Easy to change later

---

## 🚨 Important Notes

1. **Vercel Build Mode:**
   - Vercel automatically builds in **production mode**
   - `import.meta.env.DEV` = `false` in production builds
   - This triggers the automatic production URL

2. **Environment Variables Priority:**
   - If `VITE_API_URL` is set in Vercel → Uses that value
   - If NOT set → Uses automatic detection → Production URL

3. **Stripe Key:**
   - Make sure to also set `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel
   - This is required for payment functionality

4. **Redeploy After Changes:**
   - After adding/changing environment variables, **redeploy** your project
   - Or just push a new commit to trigger automatic redeploy

---

## ✅ Final Checklist

Before deploying to production:

- [ ] Backend is deployed and running at `https://eclora-sj6w.onrender.com`
- [ ] Backend CORS is configured to allow your Vercel frontend URL
- [ ] (Recommended) Set `VITE_API_URL` in Vercel environment variables
- [ ] (Required) Set `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel (if using Stripe)
- [ ] Deploy to Vercel
- [ ] Verify API calls are going to the correct backend
- [ ] Test all functionality (login, products, checkout, etc.)

---

## 🆘 Troubleshooting

### Problem: Still using localhost in production

**Possible Causes:**
1. Build cache issue
2. Environment variable not set correctly
3. Not redeployed after setting env vars

**Solution:**
1. Clear Vercel build cache
2. Verify environment variables are set correctly
3. Redeploy the project
4. Check browser console for actual API URL being used

### Problem: API calls failing

**Possible Causes:**
1. Backend CORS not configured
2. Wrong API URL
3. Backend not running

**Solution:**
1. Check backend is running: Visit `https://eclora-sj6w.onrender.com`
2. Verify CORS settings in backend
3. Check Network tab for actual API calls and errors
4. Verify environment variable value

---

## 🎉 You're All Set!

Once deployed:
- ✅ **Automatic:** Will work without configuration
- ✅ **Explicit (Recommended):** Set environment variables in Vercel for clarity

**Both approaches will use your production Render backend!** 🚀

