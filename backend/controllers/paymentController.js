const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe checkout session
// @route   POST /api/create-checkout-session
// @access  Public
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { items } = req.body;

    // Create line items for Stripe
    const lineItems = items.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      customer_email: items.email,
      metadata: {
        shippingAddress: JSON.stringify(items.shippingAddress),
        phone: items.phone,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Checkout session created',
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Stripe Error:', error);
    next(error);
  }
};

// @desc    Verify payment (webhook)
// @route   POST /api/webhook
// @access  Public
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // TODO: Create order in database
    console.log('Payment successful:', session);
  }

  res.json({ received: true });
};

