import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../store/slices/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync, isInWishlist } from '../store/slices/wishlistSlice';

const ProductCard = ({ product, showBuyNow = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const inWishlist = useSelector((state) => isInWishlist(state, product._id));

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCartAsync(product));
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store product data in sessionStorage for after login
      const buyNowProduct = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0],
        quantity: 1,
        description: product.description,
      };
      sessionStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
      // Redirect to login with return URL
      navigate('/login', { state: { from: '/checkout', requireAuth: true } });
      return;
    }
    
    // Navigate to checkout with product data (direct purchase, not adding to cart)
    navigate('/checkout', {
      state: {
        buyNowProduct: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || product.images?.[0],
          quantity: 1,
          description: product.description,
        },
      },
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      dispatch(removeFromWishlistAsync(product._id));
    } else {
      dispatch(addToWishlistAsync(product));
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden h-64">
          <img
            src={product.image || product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistToggle}
              className={`bg-white p-2 rounded-full shadow-md hover:bg-primary transition-colors ${
                inWishlist ? 'opacity-100' : ''
              }`}
            >
              <FiHeart
                className={inWishlist ? 'text-red-500 fill-current' : 'text-accent'}
                size={20}
              />
            </button>
          </div>
          {product.stock < 5 && product.stock > 0 && (
            <span className="absolute top-4 left-4 bg-accent text-white text-xs px-3 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-500 uppercase mb-1">
            {typeof product.category === 'object' ? product.category?.name : product.category}
          </p>
          <h3 className="text-lg font-heading font-semibold text-text mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between gap-2">
            <span className="text-xl font-bold text-accent">
              ${product.price?.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              {showBuyNow ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`${
                      product.stock === 0
                        ? 'bg-gray-300 cursor-not-allowed border-gray-300'
                        : 'bg-white border-accent text-accent hover:bg-primary hover:text-accent hover:border-accent'
                    } border-2 px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-sm hover:shadow-md`}
                  >
                    <FiShoppingCart size={18} />
                    <span>Add</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className={`${
                      product.stock === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-accent hover:bg-primary text-white'
                    } px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-sm hover:shadow-md`}
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`${
                    product.stock === 0
                      ? 'bg-gray-300 cursor-not-allowed border-gray-300'
                      : 'bg-white border-accent text-accent hover:bg-primary hover:text-accent hover:border-accent'
                  } border-2 px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 text-sm font-semibold shadow-sm hover:shadow-md`}
                >
                  <FiShoppingCart size={18} />
                  <span>Add</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

