import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
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
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-primary transition-colors">
              <FiHeart className="text-accent" size={20} />
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

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-accent">
              ${product.price?.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`${
                product.stock === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-accent hover:bg-primary'
              } text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors`}
            >
              <FiShoppingCart size={18} />
              <span className="text-sm">Add</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;

