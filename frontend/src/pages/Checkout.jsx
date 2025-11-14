import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { paymentService } from '../services/paymentService';
import { clearCart } from '../store/slices/cartSlice';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  country: yup.string().required('Country is required'),
});

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Prepare order data
      const orderData = {
        userId: user?._id || null, // Include user ID if logged in
        items: items.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
        email: data.email,
        phone: data.phone,
        totalAmount: totalAmount * 1.1, // Including tax
      };

      // Process checkout (Stripe or Demo mode)
      const result = await paymentService.redirectToCheckout(orderData);
      
      // If demo mode, show success message and clear cart
      if (result && result.success) {
        alert(`✅ Order placed successfully!\n\nOrder ID: ${result.orderId}\n\nThis is a DEMO order. In production, you would be redirected to Stripe payment.`);
        dispatch(clearCart());
        navigate('/');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(`❌ Checkout Error: ${error.message}\n\nPlease try again or contact support.`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-heading font-bold text-secondary mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-heading font-bold text-secondary mb-6">
                Billing Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    First Name *
                  </label>
                  <input
                    {...register('firstName')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-accent`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Last Name *
                  </label>
                  <input
                    {...register('lastName')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-accent`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-accent`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-accent`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-heading font-bold text-secondary mb-6">
                Shipping Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text mb-2">
                    Street Address *
                  </label>
                  <input
                    {...register('address')}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-accent`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-accent`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      State *
                    </label>
                    <input
                      {...register('state')}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-accent`}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      ZIP Code *
                    </label>
                    <input
                      {...register('zipCode')}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-accent`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-text mb-2">
                      Country *
                    </label>
                    <input
                      {...register('country')}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-accent`}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-4 rounded-full font-semibold hover:bg-primary hover:text-secondary transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-heading font-bold text-secondary mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold text-text">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl font-bold text-secondary">
                <span>Total</span>
                <span className="text-accent">${(totalAmount * 1.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

