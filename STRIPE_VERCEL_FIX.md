# 🔧 Fix Stripe Payment on Vercel - Step by Step Guide

## 🚨 Problem

Your Stripe payment is showing "Demo Mode" on Vercel even though it works on localhost.

**Root Cause:**
- Frontend needs `VITE_STRIPE_PUBLISHABLE_KEY` in Vercel
- Backend needs `STRIPE_SECRET_KEY` in Render

---

## ✅ Solution: Configure Stripe Keys

You need to set **TWO** environment variables:

### 1. Frontend (Vercel) - Stripe Publishable Key
### 2. Backend (Render) - Stripe Secret Key

---

## 📝 Step 1: Get Your Stripe Keys

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/
   - Login to your account

2. **Make sure you're in the correct mode:**
   - **Test Mode** (for testing): Toggle should show "Test mode"
   - **Live Mode** (for production): Toggle should show "Live mode"

3. **Get Your Keys:**
   - Go to **Developers** → **API keys**
   - Copy these keys:
     - **Publishable key** (starts with `pk_test_...` or `pk_live_...`)
     - **Secret key** (starts with `sk_test_...` or `sk_live_...`)

⚠️ **Important:**
- Use **Test keys** (`pk_test_`, `sk_test_`) for testing
- Use **Live keys** (`pk_live_`, `sk_live_`) for production
- Keep them secret - don't commit to git!

---

## 🌐 Step 2: Set Frontend Key in Vercel

### Add `VITE_STRIPE_PUBLISHABLE_KEY`

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Login to your account

2. **Select Your Frontend Project:**
   - Click on your frontend project (e.g., `ecloramaison`)

3. **Go to Settings:**
   - Click **"Settings"** tab at the top
   - In left sidebar, click **"Environment Variables"**

4. **Add Environment Variable:**
   - Click **"Add New"** button
   - **Key:** `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Value:** Your Stripe publishable key (e.g., `pk_test_...` or `pk_live_...`)
   - **Environment:** Select **"Production"** (and optionally Preview/Development)
   - Click **"Save"**

5. **Important - Redeploy:**
   - After adding env variable, you **MUST redeploy**
   - Go to **"Deployments"** tab
   - Click **"..."** menu on latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger redeploy

---

## 🔧 Step 3: Set Backend Key in Render

### Add `STRIPE_SECRET_KEY`

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com/
   - Login to your account

2. **Select Your Backend Service:**
   - Click on your Eclora backend service

3. **Go to Environment:**
   - Click **"Environment"** in left sidebar

4. **Add Environment Variable:**
   - Click **"Add Environment Variable"** or find existing `STRIPE_SECRET_KEY`
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** Your Stripe secret key (e.g., `sk_test_...` or `sk_live_...`)
   - Click **"Save Changes"**

5. **Wait for Redeploy:**
   - Render will automatically redeploy
   - Wait 2-3 minutes for deployment to complete

---

## ✅ Step 4: Verify Configuration

### Check Frontend (Vercel):

1. **After redeploy, visit your Vercel site**
2. **Open Browser Console (F12)**
3. **Go to Console tab and type:**
   ```javascript
   console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
   ```
4. **Expected:** Should show your Stripe key (starts with `pk_...`)
5. **If `undefined`:** Environment variable not set correctly

### Check Backend (Render):

1. **Go to Render Dashboard → Your Backend → Logs**
2. **Look for startup messages**
3. **Expected:** No errors about Stripe configuration

### Test Payment Flow:

1. **Add items to cart**
2. **Go to checkout**
3. **Click "Complete Order" or "Pay Now"**
4. **Expected:** 
   - ✅ No "Demo Mode" message
   - ✅ Redirects to Stripe Checkout page
   - ✅ Payment form appears

---

## 📋 Complete Environment Variables Checklist

### Vercel (Frontend):
```
✅ VITE_API_URL=https://eclora-sj6w.onrender.com/api
✅ VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)
```

### Render (Backend):
```
✅ STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
✅ CLIENT_URL=https://ecloramaison.vercel.app
✅ ADMIN_URL=https://eclora-admin.vercel.app
✅ NODE_ENV=production
✅ MONGO_URI=your_mongodb_uri
✅ JWT_SECRET=your_jwt_secret
✅ (Other required variables...)
```

---

## 🐛 Troubleshooting

### Issue: Still showing "Demo Mode" after setting keys

**Solutions:**

1. **Verify Key is Set:**
   - Check Vercel → Settings → Environment Variables
   - Make sure `VITE_STRIPE_PUBLISHABLE_KEY` exists
   - Check value is correct (no spaces, no quotes)

2. **Redeploy Required:**
   - ⚠️ **CRITICAL:** After adding env vars, you MUST redeploy!
   - Environment variables are baked into the build
   - Old deployment doesn't have new variables

3. **Check Browser Console:**
   ```javascript
   console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
   ```
   - If `undefined`: Variable not set or not redeployed
   - If shows key: Should work

4. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache completely

### Issue: "Stripe is not configured" error on backend

**Solutions:**

1. **Check Render Environment Variables:**
   - Go to Render → Environment
   - Verify `STRIPE_SECRET_KEY` is set
   - Value should start with `sk_test_` or `sk_live_`

2. **Check Render Logs:**
   - Look for errors about Stripe
   - Verify backend started successfully

3. **Wait for Redeploy:**
   - After setting env vars, wait 2-3 minutes
   - Check logs to see if deployment completed

### Issue: Payment redirects but Stripe page doesn't load

**Possible Causes:**

1. **Wrong Stripe Key:**
   - Test key vs Live key mismatch
   - Frontend and backend must use same mode (both test or both live)

2. **CORS Error:**
   - Make sure `CLIENT_URL` is set correctly in Render
   - Should match your Vercel frontend URL exactly

3. **Backend API Error:**
   - Check Render logs for errors
   - Verify `STRIPE_SECRET_KEY` is valid

---

## 🔍 Quick Verification Checklist

After setting everything up:

- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` set in Vercel
- [ ] `STRIPE_SECRET_KEY` set in Render
- [ ] Frontend redeployed after setting env var
- [ ] Backend redeployed after setting env var
- [ ] Browser console shows Stripe key (not undefined)
- [ ] No "Demo Mode" message on payment page
- [ ] Stripe Checkout page loads when clicking "Pay"

---

## 📝 Common Mistakes

1. **Not Redeploying:**
   - ❌ Setting env var but not redeploying
   - ✅ Set env var → Redeploy → Test

2. **Wrong Variable Name:**
   - ❌ `STRIPE_PUBLISHABLE_KEY` (missing `VITE_` prefix)
   - ✅ `VITE_STRIPE_PUBLISHABLE_KEY` (correct)

3. **Test vs Live Keys:**
   - ❌ Using test key in production or vice versa
   - ✅ Match test keys with test mode, live keys with live mode

4. **Extra Spaces/Quotes:**
   - ❌ `pk_test_123... ` (space at end)
   - ❌ `"pk_test_123..."` (quotes included)
   - ✅ `pk_test_123...` (clean, no quotes)

---

## 🎯 Expected Behavior After Fix

### Before Fix:
- ❌ Shows "Demo Mode" message
- ❌ "Complete Demo Order" button
- ❌ No actual Stripe payment

### After Fix:
- ✅ Shows "Secure Payment Gateway" section
- ✅ "Complete Payment" or "Pay Now" button
- ✅ Redirects to Stripe Checkout
- ✅ Real payment processing

---

## 🚀 Quick Fix Steps Summary

1. **Get Stripe keys** from Stripe Dashboard
2. **Set in Vercel:** `VITE_STRIPE_PUBLISHABLE_KEY`
3. **Set in Render:** `STRIPE_SECRET_KEY`
4. **Redeploy both** (Vercel + Render)
5. **Test payment** flow

**Total time: ~10 minutes** ⏱️

---

## 🆘 Still Not Working?

If issues persist:

1. **Check Browser Console:**
   - Look for any errors
   - Check if Stripe key is loaded

2. **Check Network Tab:**
   - Look at API calls to `/api/create-checkout-session`
   - Check response for errors

3. **Check Render Logs:**
   - Look for Stripe-related errors
   - Verify backend is receiving requests

4. **Verify Keys:**
   - Make sure keys match (both test or both live)
   - Keys should be from same Stripe account

---

**After following these steps, your Stripe payment should work perfectly on Vercel!** 💳✨

