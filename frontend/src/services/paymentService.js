import api from './api';
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' || !stripePublishableKey;

export const paymentService = {
  createCheckoutSession: async (orderData) => {
    try {
      // Ensure the data structure matches what backend expects
      const requestData = {
        items: {
          items: orderData.items || [],
          email: orderData.email || '',
          phone: orderData.phone || '',
          userId: orderData.userId || null,
          shippingAddress: orderData.shippingAddress || {},
          totalAmount: orderData.totalAmount || 0,
        },
      };
      
      console.log('Sending checkout request:', requestData);
      const response = await api.post('/create-checkout-session', requestData);
      return response.data;
    } catch (error) {
      console.error('Checkout session error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Demo payment flow for development (no Stripe required)
  demoCheckout: async (orderData) => {
    // Create order in the actual database via API
    try {
      const response = await api.post('/orders', {
        userId: orderData.userId || null, // null for guest checkout
        products: orderData.items,
        shippingAddress: orderData.shippingAddress,
        email: orderData.email,
        phone: orderData.phone,
        totalAmount: orderData.totalAmount,
        stripeSessionId: `demo-${Date.now()}`,
        paymentStatus: 'paid', // Auto-mark as paid in demo mode
        orderStatus: 'pending',
      });
      
      return {
        success: true,
        orderId: response.data._id,
        message: 'Order created successfully!',
        data: response.data,
      };
    } catch (error) {
      console.error('Demo checkout error:', error);
      throw new Error('Failed to create order. Please try again.');
    }
  },

  redirectToCheckout: async (items) => {
    // Use demo mode if Stripe is not configured
    if (isDemoMode) {
      console.log('🎭 Running in DEMO MODE - No Stripe configuration needed');
      const result = await paymentService.demoCheckout(items);
      return result;
    }

    // Production Stripe flow
    const stripe = await loadStripe(stripePublishableKey);
    
    if (!stripe) {
      throw new Error('Failed to load Stripe. Please check your Stripe publishable key.');
    }

    const { data } = await paymentService.createCheckoutSession(items);
    
    const result = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result;
  },
};

