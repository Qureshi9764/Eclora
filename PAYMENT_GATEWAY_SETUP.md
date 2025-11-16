# Payment Gateway Setup Guide for Eclora

## Recommended: Stripe (Already Partially Integrated)

### Why Stripe?
✅ **Already in your codebase** - Minimal additional work needed
✅ **Developer-friendly** - Excellent documentation and support
✅ **Global support** - Works in 40+ countries
✅ **Multiple payment methods** - Cards, Apple Pay, Google Pay, etc.
✅ **No monthly fees** - Only pay per transaction
✅ **Free test mode** - Test without real charges

### Pricing
- **No monthly fee**
- **2.9% + $0.30** per successful card transaction (US)
- **Free** for test mode (unlimited test transactions)

---

## Setup Steps

### 1. Create Stripe Account (FREE)
1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Fill in your business details
4. Verify your email

### 2. Get API Keys

#### Test Mode (Development)
1. After logging in, you'll be in **Test mode** by default
2. Go to **Developers** → **API keys**
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

#### Live Mode (Production)
1. Toggle to **Live mode** in Stripe dashboard
2. Get your live keys:
   - **Publishable key** (starts with `pk_live_...`)
   - **Secret key** (starts with `sk_live_...`)

### 3. Add Keys to Your Project

#### Backend (.env file)
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

#### Frontend (.env file)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_DEMO_MODE=false
```

### 4. Set Up Webhook (For Production)

Webhooks notify your backend when payment is successful.

#### Using Stripe CLI (Recommended for Development)
1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:5000/api/webhook`
4. Copy the webhook signing secret (starts with `whsec_...`)
5. Add to backend `.env`: `STRIPE_WEBHOOK_SECRET=whsec_your_secret_here`

#### Using Stripe Dashboard (For Production)
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhook`
4. Select events: `checkout.session.completed`
5. Copy the **Signing secret**
6. Add to backend `.env`: `STRIPE_WEBHOOK_SECRET=whsec_your_secret_here`

### 5. Test Your Integration

1. Use test card numbers from Stripe:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC

2. Test the checkout flow:
   - Add product to cart
   - Click "Buy Now" or proceed to checkout
   - Use test card number
   - Verify order is created in database

---

## Alternative Payment Gateways

### PayPal
**Pros:**
- Widely trusted by customers
- Easy integration with PayPal SDK
- Supports PayPal balance, cards, and bank transfers

**Cons:**
- Higher fees (2.9% + $0.30)
- Less developer-friendly than Stripe
- Requires separate integration

**Pricing:** No monthly fee, 2.9% + $0.30 per transaction

**Integration:** Requires PayPal SDK installation and separate implementation

---

### Square
**Pros:**
- Good for businesses with both online and in-person sales
- Simple setup process
- Unified dashboard

**Cons:**
- Less flexible than Stripe
- Limited customization options

**Pricing:** 2.9% + $0.30 per online transaction

**Integration:** Requires Square SDK and separate implementation

---

### Razorpay (India Only)
**Pros:**
- Best for Indian market
- Lower fees (2% per transaction)
- Supports UPI, cards, wallets

**Cons:**
- Only available in India
- Requires Indian business registration

**Pricing:** 2% per transaction, no monthly fee

**Integration:** Requires Razorpay SDK and separate implementation

---

## What You Need to Integrate

### Free Resources:
1. ✅ **Stripe Account** - Free to create
2. ✅ **Test API Keys** - Free (unlimited test transactions)
3. ✅ **Stripe Documentation** - Free and comprehensive
4. ✅ **Stripe CLI** - Free tool for webhook testing

### Paid (Only When Live):
1. 💰 **Transaction Fees** - 2.9% + $0.30 per successful payment
2. 💰 **No monthly subscription** - Pay only when you make sales

### Required Setup:
1. ✅ Stripe account (5 minutes)
2. ✅ API keys added to `.env` files (2 minutes)
3. ✅ Webhook endpoint configured (10 minutes)
4. ✅ Test with test cards (5 minutes)

---

## Current Integration Status

✅ **Backend:** Stripe controller and routes are set up
✅ **Frontend:** Payment service is configured
✅ **Webhook:** Order creation logic is implemented
⚠️ **Needs:** API keys in environment variables

---

## Next Steps

1. **Create Stripe account** (if you haven't already)
2. **Get test API keys** from Stripe dashboard
3. **Add keys to your `.env` files**
4. **Test with test card numbers**
5. **Set up webhook** for production
6. **Switch to live keys** when ready to go live

---

## Support Resources

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Stripe Support:** Available in dashboard
- **Stripe Test Cards:** [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

---

## Recommendation

**Use Stripe** because:
1. It's already partially integrated in your codebase
2. It's the most developer-friendly option
3. No monthly fees - only pay per transaction
4. Excellent documentation and support
5. Works globally
6. Free test mode for development

You can complete the integration in about 30 minutes!

