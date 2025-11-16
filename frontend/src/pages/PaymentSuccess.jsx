import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiHome, FiShoppingBag } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartAsync } from '../store/slices/cartSlice';
import api from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState(location.state?.orderDetails || null);
  const [loading, setLoading] = useState(!!sessionId && !location.state?.isDemo);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const verifyPayment = async () => {
      // If demo mode, use order from state
      if (location.state?.isDemo && location.state?.orderId) {
        try {
          const response = await api.get(`/orders/${location.state.orderId}`);
          if (response.data.success) {
            setOrderDetails(response.data.data || response.data);
            dispatch(clearCartAsync());
          }
        } catch (err) {
          console.error('Error fetching demo order:', err);
        }
        setLoading(false);
        return;
      }

      if (!sessionId) {
        setError('No session ID found');
        setLoading(false);
        return;
      }

      try {
        // Verify payment with backend
        const response = await api.get(`/orders/session/${sessionId}`);
        
        if (response.data.success) {
          setOrderDetails(response.data.order);
          
          // Clear cart after successful payment
          dispatch(clearCartAsync());
        } else {
          setError('Payment verification failed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Unable to verify payment. Please contact support if you were charged.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, dispatch, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-heading font-bold text-secondary mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Link
                to="/"
                className="block w-full bg-accent text-white py-3 rounded-full font-semibold hover:bg-primary hover:text-secondary transition-all"
              >
                Go to Home
              </Link>
              <Link
                to="/contact"
                className="block w-full border-2 border-accent text-accent py-3 rounded-full font-semibold hover:bg-accent hover:text-white transition-all"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiCheckCircle size={48} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-50">Thank you for your purchase</p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            {orderDetails && (
              <>
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <FiPackage className="text-accent" size={24} />
                    <h2 className="text-xl font-heading font-semibold text-secondary">
                      Order Details
                    </h2>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-semibold text-secondary">
                        #{orderDetails._id?.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-accent text-lg">
                        ${orderDetails.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        {orderDetails.paymentStatus || 'Paid'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Status:</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                        {orderDetails.orderStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Products Ordered */}
                {orderDetails.products && orderDetails.products.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-heading font-semibold text-secondary mb-4">
                      Items Ordered
                    </h3>
                    <div className="space-y-3">
                      {orderDetails.products.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-secondary">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity} × ${item.price?.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-accent">
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {orderDetails.shippingAddress && (
                  <div className="mb-6">
                    <h3 className="text-lg font-heading font-semibold text-secondary mb-4">
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        {orderDetails.shippingAddress.firstName}{' '}
                        {orderDetails.shippingAddress.lastName}
                      </p>
                      <p className="text-gray-700">{orderDetails.shippingAddress.address}</p>
                      <p className="text-gray-700">
                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{' '}
                        {orderDetails.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-700">{orderDetails.shippingAddress.country}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Confirmation Message */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
              <p className="text-gray-700 text-center">
                <strong>What's next?</strong>
              </p>
              <p className="text-gray-600 text-center mt-2">
                You'll receive an email confirmation at{' '}
                <strong>{orderDetails?.email || 'your email'}</strong> with your order details and
                tracking information once your order ships.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/"
                className="flex items-center justify-center space-x-2 bg-accent text-white py-3 rounded-full font-semibold hover:bg-primary hover:text-secondary transition-all transform hover:scale-105"
              >
                <FiHome size={20} />
                <span>Continue Shopping</span>
              </Link>
              {isAuthenticated && (
                <Link
                  to="/orders"
                  className="flex items-center justify-center space-x-2 border-2 border-accent text-accent py-3 rounded-full font-semibold hover:bg-accent hover:text-white transition-all transform hover:scale-105"
                >
                  <FiShoppingBag size={20} />
                  <span>View Orders</span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

