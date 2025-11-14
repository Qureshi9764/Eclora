import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Try to get featured products first, if none exist, get all products
      let response = await productService.getFeaturedProducts();
      let products = response.data || [];
      
      // If no featured products, get regular products
      if (products.length === 0) {
        response = await productService.getAllProducts({ limit: 8 });
        products = response.data || [];
      }
      
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoryService.getAllCategories();
      const dbCategories = response.data || response || [];
      
      // If no categories in database, use fallback
      if (dbCategories.length === 0) {
        setCategories([
          {
            _id: '1',
            name: 'Candles',
            image: 'https://images.pexels.com/photos/6101956/pexels-photo-6101956.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Handcrafted with natural wax',
          },
          {
            _id: '2',
            name: 'Floral Fragrance',
            image: 'https://images.pexels.com/photos/5490918/pexels-photo-5490918.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Botanical scents for your home',
          },
          {
            _id: '3',
            name: 'Gift Sets',
            image: 'https://images.pexels.com/photos/5624103/pexels-photo-5624103.jpeg?auto=compress&cs=tinysrgb&w=1200',
            description: 'Perfect for special occasions',
          },
        ]);
      } else {
        setCategories(dbCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories([
        {
          _id: '1',
          name: 'Candles',
          image: 'https://images.pexels.com/photos/6101956/pexels-photo-6101956.jpeg?auto=compress&cs=tinysrgb&w=1200',
          description: 'Handcrafted with natural wax',
        },
        {
          _id: '2',
          name: 'Floral Fragrance',
          image: 'https://images.pexels.com/photos/5490918/pexels-photo-5490918.jpeg?auto=compress&cs=tinysrgb&w=1200',
          description: 'Botanical scents for your home',
        },
        {
          _id: '3',
          name: 'Gift Sets',
          image: 'https://images.pexels.com/photos/5624103/pexels-photo-5624103.jpeg?auto=compress&cs=tinysrgb&w=1200',
          description: 'Perfect for special occasions',
        },
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'The candles from Eclora are absolutely divine! The scents are subtle yet long-lasting, and the quality is exceptional.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      text: 'I bought a gift set for my wife and she loved it! Beautiful packaging and wonderful fragrances.',
      rating: 5,
    },
    {
      name: 'Emma Williams',
      text: 'These are the best handmade candles I have ever purchased. The attention to detail is remarkable.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/6101956/pexels-photo-6101956.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 drop-shadow-lg">
            Handcrafted Candles & Fragrances
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-md">by Eclora</p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-primary text-secondary px-8 py-4 rounded-full font-semibold hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>Shop Now</span>
            <FiArrowRight />
          </Link>
        </motion.div>
      </section>

      {/* Category Highlights */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-heading font-bold text-secondary mb-4">
            Explore Our Collections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collections of handmade candles and fragrances
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoriesLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
              ))
          ) : (
            categories.map((category, index) => (
              <motion.div
                key={category._id || category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative h-96 rounded-lg overflow-hidden cursor-pointer"
              >
                <img
                  src={category.image || 'https://images.pexels.com/photos/6101956/pexels-photo-6101956.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-3xl font-heading font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/90 mb-4">{category.description}</p>
                  <Link
                    to={`/shop?category=${category.name}`}
                    className="text-primary hover:text-accent transition-colors inline-flex items-center space-x-2"
                  >
                    <span>Explore</span>
                    <FiArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent to-primary/10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-heading font-bold text-secondary mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most loved handcrafted candles and fragrances
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>

        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 text-accent hover:text-primary transition-colors font-semibold text-lg"
          >
            <span>View All Products</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-heading font-bold text-secondary mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read reviews from our satisfied customers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex mb-4">
                {Array(testimonial.rating)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-accent text-xl">
                      ★
                    </span>
                  ))}
              </div>
              <p className="text-gray-600 mb-4 italic">&quot;{testimonial.text}&quot;</p>
              <p className="font-semibold text-text">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-accent text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Join Our Newsletter
          </h2>
          <p className="mb-8 text-white/90">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 rounded-full text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-secondary px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

