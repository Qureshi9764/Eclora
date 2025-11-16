# Stripe UPI Payment Setup Guide

## UPI Payment Methods Supported by Stripe

Stripe supports **UPI (Unified Payments Interface)** payments in India, which includes:

✅ **Google Pay** (GPay)
✅ **PhonePe**
✅ **Paytm**
✅ **BHIM UPI**
✅ **Amazon Pay**
✅ **All other UPI apps** (Any UPI-enabled app)

---

## Requirements for UPI Support

### 1. Stripe India Account
- You need a **Stripe India account** (not just a regular Stripe account)
- Register at: [https://stripe.com/in](https://stripe.com/in)
- Requires Indian business registration

### 2. Currency Setting
- Set currency to **INR (Indian Rupees)** in your environment variables
- UPI only works with INR currency

### 3. Payment Methods
When currency is set to INR, Stripe automatically enables:
- **Cards** (Visa, Mastercard, RuPay, etc.)
- **UPI** (Google Pay, PhonePe, Paytm, etc.)
- **Net Banking** (All major Indian banks)
- **Wallets** (Paytm, Freecharge, etc.)

---

## Setup Instructions

### Step 1: Create Stripe India Account

1. Go to [https://stripe.com/in](https://stripe.com/in)
2. Click "Start now"
3. Select **India** as your country
4. Complete business registration with:
   - Indian business entity (Company/LLP/Partnership)
   - GST number (if applicable)
   - Bank account details (Indian bank account required)

### Step 2: Get API Keys

1. After account setup, go to **Developers** → **API keys**
2. Copy your keys:
   - **Publishable key** (starts with `pk_live_...` or `pk_test_...`)
   - **Secret key** (starts with `sk_live_...` or `sk_test_...`)

### Step 3: Configure Environment Variables

#### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_your_india_stripe_key
STRIPE_CURRENCY=inr
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_india_stripe_key
VITE_DEMO_MODE=false
```

### Step 4: Update Product Prices

If you're switching from USD to INR:
- Update all product prices in your database to INR
- Example: $32.00 → ₹2,500 (approximate conversion)

---

## How It Works

### Automatic Payment Method Detection

When currency is set to **INR**, Stripe Checkout automatically shows:

1. **Card Payment** - All major cards
2. **UPI** - Google Pay, PhonePe, Paytm, etc.
3. **Net Banking** - Direct bank transfers
4. **Wallets** - Paytm wallet, etc.

### Customer Experience

1. Customer clicks "Buy Now" or proceeds to checkout
2. Stripe Checkout page opens
3. Customer sees multiple payment options:
   - **UPI** section with QR code and app options
   - **Cards** section
   - **Net Banking** dropdown
   - **Wallets** section
4. Customer selects their preferred method
5. Payment is processed instantly

---

## Pricing for Indian Payments

### UPI Payments
- **2% + ₹2** per successful UPI transaction
- Lower fees than cards!

### Card Payments (INR)
- **2% + ₹2** per successful card transaction
- Same for domestic and international cards

### Net Banking
- **2% + ₹2** per transaction

### Wallets
- **2% + ₹2** per transaction

**Note:** Fees are generally lower for Indian payment methods compared to international card processing.

---

## Testing UPI Payments

### Test Mode UPI
Stripe provides test UPI IDs for testing:

1. Use test API keys
2. In Stripe Checkout, select UPI
3. Use test UPI ID: `success@upi` (for successful payment)
4. Use test UPI ID: `failure@upi` (for failed payment)

### Test Cards (INR)
- **Success**: `4000 0035 6000 0008`
- **Decline**: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

---

## Code Changes Made

I've updated your payment controller to:

1. ✅ **Detect currency** from environment variable
2. ✅ **Enable UPI** when currency is INR
3. ✅ **Support multiple payment methods** (cards, UPI, netbanking, wallets)
4. ✅ **Handle INR currency** correctly (paise conversion)

---

## Important Notes

### For International Customers
- If you want to serve both Indian and international customers:
  - You can detect customer location and switch currency
  - Or maintain separate Stripe accounts (India + International)
  - Or use Stripe's multi-currency support

### Business Requirements
- **Indian Stripe account** requires:
  - Indian business registration
  - Indian bank account
  - GST number (if applicable)
  - KYC verification

### Alternative: Razorpay
If you're primarily targeting Indian customers:
- **Razorpay** is India-specific and easier to set up
- Lower fees (2% flat rate)
- Better UPI integration
- No international business requirements

---

## Recommendation

**For Indian Market:**
- Use **Stripe India** if you want global + Indian support
- Use **Razorpay** if you're India-only (easier setup, better UPI UX)

**For International Market:**
- Use **Stripe** (regular account) with USD/EUR/etc.
- UPI not available (India-only feature)

---

## Next Steps

1. **Decide your market:**
   - India only → Consider Razorpay
   - Global + India → Use Stripe India account
   - International only → Use regular Stripe

2. **If using Stripe India:**
   - Create Stripe India account
   - Complete business verification
   - Set `STRIPE_CURRENCY=inr` in backend `.env`
   - Update product prices to INR

3. **Test UPI payments:**
   - Use test mode
   - Test with `success@upi` UPI ID
   - Verify orders are created correctly

---

## Support

- **Stripe India Docs:** [https://stripe.com/docs/payments/upi](https://stripe.com/docs/payments/upi)
- **Stripe India Support:** Available in dashboard
- **UPI Testing Guide:** [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

