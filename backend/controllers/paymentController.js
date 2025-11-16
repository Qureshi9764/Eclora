const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe checkout session
// @route   POST /api/create-checkout-session
// @access  Public
exports.createCheckoutSession = async (req, res, next) => {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in your .env file.',
      });
    }

    const { items } = req.body;

    // Debug logging
    console.log('Received checkout request:', JSON.stringify(req.body, null, 2));

    // Validate required fields
    if (!items) {
      return res.status(400).json({
        success: false,
        message: 'Items object is required',
        received: Object.keys(req.body),
      });
    }

    if (!items.items || !Array.isArray(items.items) || items.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required and must not be empty',
        received: items,
      });
    }

    // Validate and format CLIENT_URL
    let clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    
    // Remove trailing slash if present
    clientUrl = clientUrl.replace(/\/$/, '');
    
    // Ensure URL has protocol
    if (!clientUrl.startsWith('http://') && !clientUrl.startsWith('https://')) {
      clientUrl = `http://${clientUrl}`;
    }

    // Validate URL format
    try {
      new URL(clientUrl);
    } catch (urlError) {
      return res.status(400).json({
        success: false,
        message: `Invalid CLIENT_URL: ${clientUrl}. Please set a valid URL in your .env file.`,
      });
    }

    // Get currency from environment or default to USD
    const currency = process.env.STRIPE_CURRENCY || 'usd';
    const currencyCode = currency.toLowerCase();
    
    // Determine amount multiplier (100 for USD/cents, 100 for INR/paise)
    const amountMultiplier = 100; // Both USD and INR use 100 as base unit
    
    // Create line items for Stripe
    const lineItems = items.items.map((item) => {
      if (!item.name || !item.price) {
        throw new Error('Each item must have a name and price');
      }
      
      // Validate and filter image URLs
      let images = [];
      if (item.image) {
        try {
          // Validate image URL
          const imageUrl = new URL(item.image);
          if (imageUrl.protocol === 'http:' || imageUrl.protocol === 'https:') {
            images = [item.image];
          }
        } catch (urlError) {
          // Invalid image URL, skip it
          console.warn(`Invalid image URL for product ${item.name}: ${item.image}`);
        }
      }
      
      return {
        price_data: {
          currency: currencyCode,
          product_data: {
            name: item.name,
            description: item.description || '',
            images: images,
          },
          unit_amount: Math.round(item.price * amountMultiplier), // Convert to smallest currency unit
        },
        quantity: item.quantity || 1,
      };
    });

    // Determine payment methods based on currency/region
    // For USD: cards only. For INR: cards + UPI + other Indian methods
    const paymentMethodTypes = currencyCode === 'inr' 
      ? ['card', 'upi', 'netbanking', 'wallet'] // Indian payment methods
      : ['card']; // International (cards only)

    // Build success and cancel URLs
    const successUrl = `${clientUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${clientUrl}/cart`;

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      currency: currencyCode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: items.email,
      // For Indian customers, add phone number for UPI
      ...(currencyCode === 'inr' && items.phone && {
        payment_method_options: {
          upi: {
            preferred_network: 'google_pay', // or 'phonepe', 'paytm', etc.
          },
        },
      }),
      metadata: {
        userId: items.userId || '',
        shippingAddress: JSON.stringify(items.shippingAddress || {}),
        phone: items.phone || '',
        email: items.email || '',
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
    
    // Provide more helpful error messages
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        message: error.message || 'Invalid request to Stripe. Please check your configuration.',
        details: error.raw?.message,
      });
    }
    
    if (error.message && error.message.includes('URL')) {
      return res.status(400).json({
        success: false,
        message: `Invalid URL configuration: ${error.message}. Please check your CLIENT_URL in .env file.`,
      });
    }
    
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
    
    try {
      // Retrieve the full session to get line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      // Parse metadata
      const shippingAddress = session.metadata?.shippingAddress 
        ? JSON.parse(session.metadata.shippingAddress)
        : {};
      
      // Create order in database
      const Order = require('../models/Order');
      const order = await Order.create({
        userId: session.metadata?.userId || null,
        products: fullSession.line_items.data.map((item) => ({
          productId: item.price_data?.product || null,
          name: item.description || item.price_data?.product_data?.name || 'Product',
          price: item.price_data?.unit_amount / 100, // Convert from cents
          quantity: item.quantity,
        })),
        shippingAddress,
        email: session.customer_email || session.metadata?.email || '',
        phone: session.metadata?.phone || '',
        totalAmount: session.amount_total / 100, // Convert from cents
        stripeSessionId: session.id,
        paymentStatus: 'paid',
        orderStatus: 'pending',
      });

      console.log('Order created successfully:', order._id);
    } catch (error) {
      console.error('Error creating order from webhook:', error);
      // Don't fail the webhook, Stripe will retry
    }
  }

  res.json({ received: true });
};

