# Stripe Test Credentials for Eclora

## Test Card Numbers

Use these test card numbers in **Stripe Test Mode** to simulate different payment scenarios:

### ✅ Successful Payments

#### Standard Cards
- **Visa (Success):** `4242 4242 4242 4242`
- **Visa (Debit):** `4000 0566 5566 5556`
- **Mastercard:** `5555 5555 5555 4444`
- **American Express:** `3782 822463 10005`
- **Discover:** `6011 1111 1111 1117`

#### 3D Secure Cards (Requires Authentication)
- **Visa (3D Secure):** `4000 0025 0000 3155`
- **Mastercard (3D Secure):** `5200 8282 8282 8210`

### ❌ Declined Cards

- **Card Declined:** `4000 0000 0000 0002`
- **Insufficient Funds:** `4000 0000 0000 9995`
- **Lost Card:** `4000 0000 0000 9987`
- **Stolen Card:** `4000 0000 0000 9979`
- **Expired Card:** `4000 0000 0000 0069`
- **Incorrect CVC:** `4000 0000 0000 0127`
- **Processing Error:** `4000 0000 0000 0119`

### 💳 Card Details for Testing

For all test cards, use:
- **Expiry Date:** Any future date (e.g., `12/25`, `01/26`)
- **CVC:** Any 3 digits (e.g., `123`, `456`)
- **ZIP Code:** Any 5 digits (e.g., `12345`)

### 🇮🇳 Indian Payment Methods (UPI)

If testing with INR currency:

#### UPI Test Credentials
- **Google Pay:** Use any valid UPI ID format (e.g., `test@paytm`, `test@ybl`)
- **PhonePe:** Use test UPI ID
- **Paytm:** Use test UPI ID

**Note:** For UPI testing, you may need to use Stripe's test UPI flow or test in live mode with small amounts.

## How to Use Test Cards

1. **Make sure you're in Stripe Test Mode:**
   - Your Stripe dashboard should show "Test mode" toggle
   - Use test API keys (starting with `pk_test_` and `sk_test_`)

2. **Enter Test Card Details:**
   - Card Number: Use any test card number above
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

3. **Test Different Scenarios:**
   - Use `4242 4242 4242 4242` for successful payments
   - Use `4000 0000 0000 0002` to test declined card handling
   - Use `4000 0025 0000 3155` to test 3D Secure authentication

## Example Test Order Flow

1. Add products to cart
2. Go to checkout and fill address form
3. Click "Continue to Payment"
4. On payment page, click "Pay $XX.XX"
5. You'll be redirected to Stripe Checkout
6. Enter test card: `4242 4242 4242 4242`
7. Expiry: `12/25`
8. CVC: `123`
9. Click "Pay"
10. Payment will succeed and redirect to success page

## Test API Keys Setup

### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
CLIENT_URL=http://localhost:5173
STRIPE_CURRENCY=usd
```

### Frontend (.env)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
VITE_DEMO_MODE=false
```

## Getting Your Test API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top right)
3. Go to **Developers** → **API keys**
4. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

## Testing Different Payment Methods

### Credit/Debit Cards
- Use the test card numbers above
- All major card brands are supported

### Digital Wallets (if enabled)
- Apple Pay: Use test card in Apple Pay
- Google Pay: Use test card in Google Pay

### UPI (India - INR currency)
- Requires INR currency setting
- Use test UPI IDs or test in live mode with small amounts

## Common Test Scenarios

### ✅ Test Successful Payment
- Card: `4242 4242 4242 4242`
- Expected: Order created, redirect to success page

### ❌ Test Declined Payment
- Card: `4000 0000 0000 0002`
- Expected: Error message, stay on payment page

### 🔐 Test 3D Secure
- Card: `4000 0025 0000 3155`
- Expected: Additional authentication step, then success

### 💰 Test Different Amounts
- Small amount: $1.00
- Large amount: $999.99
- Decimal amounts: $59.40

## Important Notes

⚠️ **Never use test cards in live mode!**
- Test cards only work in Stripe Test Mode
- Real cards only work in Live Mode
- Test mode transactions don't charge real money

✅ **Test Mode Benefits:**
- No real charges
- Unlimited test transactions
- Test all scenarios safely
- View test data in Stripe Dashboard

## Troubleshooting

### Payment Not Working?
1. Check you're using test API keys (`pk_test_` and `sk_test_`)
2. Verify `CLIENT_URL` is correct in backend `.env`
3. Check browser console for errors
4. Check backend logs for Stripe errors

### Card Declined?
- Make sure you're using a test card number
- Check expiry date is in the future
- Verify CVC is 3 digits

### Redirect Not Working?
- Check `CLIENT_URL` in backend `.env`
- Ensure success URL is correctly formatted
- Check browser console for redirect errors

## Need Help?

- [Stripe Test Cards Documentation](https://stripe.com/docs/testing)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- Check your Stripe Dashboard → Payments for test transaction details

