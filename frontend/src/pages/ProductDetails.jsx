import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data);
      
      // Fetch related products
      if (response.data?.category) {
        const categoryId = typeof response.data.category === 'object' 
          ? response.data.category._id 
          : response.data.category;
          
        const relatedResponse = await productService.getAllProducts({
          category: categoryId,
          limit: 4,
        });
        setRelatedProducts(
          relatedResponse.data.filter((p) => p._id !== id).slice(0, 4)
        );
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-heading font-bold text-secondary mb-4">
          Product Not Found
        </h2>
        <Link to="/shop" className="text-accent hover:text-primary transition-colors">
          Back to Shop
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image]
    : ['https://via.placeholder.com/600'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-600">
        <Link to="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-accent">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-text">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </motion.div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-accent'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-sm text-accent uppercase tracking-wide mb-2">
            {typeof product.category === 'object' ? product.category?.name : product.category}
          </p>
          <h1 className="text-4xl font-heading font-bold text-secondary mb-4">
            {product.name}
          </h1>
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-accent">
              ${product.price?.toFixed(2)}
            </span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.brand && (
            <div className="mb-6">
              <span className="text-sm text-gray-600">Brand: </span>
              <span className="text-sm font-semibold text-text">{product.brand}</span>
            </div>
          )}

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center space-x-2 px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-primary hover:text-secondary'
              }`}
            >
              <FiShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            <button className="bg-white border-2 border-accent text-accent px-6 py-4 rounded-full hover:bg-accent hover:text-white transition-all transform hover:scale-105 flex items-center justify-center">
              <FiHeart size={20} />
            </button>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-text mb-3">Product Features</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ 100% Natural Ingredients</li>
              <li>✓ Hand-poured with Love</li>
              <li>✓ Long-lasting Fragrance</li>
              <li>✓ Eco-friendly Packaging</li>
              <li>✓ Cruelty-free & Vegan</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-heading font-bold text-secondary mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;

