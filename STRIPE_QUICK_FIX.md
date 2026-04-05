# ⚡ Quick Stripe Fix - 5 Minutes

## 🚨 Problem
Stripe showing "Demo Mode" on Vercel but works on localhost.

## ✅ Quick Fix

### Step 1: Get Stripe Keys (1 minute)
1. Go to: https://dashboard.stripe.com/
2. Developers → API keys
3. Copy:
   - **Publishable key** (`pk_test_...` or `pk_live_...`)
   - **Secret key** (`sk_test_...` or `sk_live_...`)

### Step 2: Set in Vercel (2 minutes)
1. Go to: https://vercel.com/dashboard
2. Your frontend project → Settings → Environment Variables
3. Add:
   - **Key:** `VITE_STRIPE_PUBLISHABLE_KEY`
   - **Value:** Your publishable key (e.g., `pk_test_...`)
   - **Environment:** Production
4. **Save** → **Redeploy** ⚠️

### Step 3: Set in Render (2 minutes)
1. Go to: https://dashboard.render.com/
2. Your backend service → Environment
3. Add/Update:
   - **Key:** `STRIPE_SECRET_KEY`
   - **Value:** Your secret key (e.g., `sk_test_...`)
4. **Save** → Wait for redeploy

### Step 4: Test
1. Visit your Vercel site
2. Go to checkout
3. ✅ Should show Stripe payment (not Demo Mode)

---

## ⚠️ Important Notes

1. **Redeploy Required:** After setting env vars, you MUST redeploy Vercel!
2. **Variable Names:**
   - Frontend: `VITE_STRIPE_PUBLISHABLE_KEY` (with `VITE_` prefix)
   - Backend: `STRIPE_SECRET_KEY` (no prefix)
3. **Both Keys Needed:**
   - Frontend needs publishable key
   - Backend needs secret key
4. **Test vs Live:**
   - Use test keys (`pk_test_`, `sk_test_`) for testing
   - Use live keys (`pk_live_`, `sk_live_`) for production

---

## 🔍 Verify It's Working

Open browser console (F12) and type:
```javascript
console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

**Should show:** Your Stripe key (starts with `pk_...`)
**If `undefined`:** Variable not set or not redeployed

---

**For detailed guide, see: `STRIPE_VERCEL_FIX.md`**

