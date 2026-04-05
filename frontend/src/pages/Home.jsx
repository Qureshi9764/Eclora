import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiDroplet,
  FiFeather,
  FiGift,
  FiShield,
  FiPackage,
  FiScissors,
  FiLayers,
} from 'react-icons/fi';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { bannerService } from '../services/bannerService';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';

const fallbackCategories = [
  {
    _id: 'candles',
    name: 'Candles',
    image:
      'https://images.pexels.com/photos/6101956/pexels-photo-6101956.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Hand-poured soy candles with layered aroma profiles.',
  },
  {
    _id: 'bouquets',
    name: 'Bouquets',
    image:
      'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Seasonal floral compositions styled for gifting & décor.',
  },
  {
    _id: 'custom-gifting',
    name: 'Custom Gifting',
    image:
      'https://images.pexels.com/photos/5632406/pexels-photo-5632406.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Curated boxes tailored for celebrations and premium clients.',
  },
  {
    _id: 'hijabi-essentials',
    name: 'Hijabi Essentials',
    image:
      'https://images.pexels.com/photos/6311655/pexels-photo-6311655.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Lightweight scarves, travel-friendly pins, and accessories.',
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [heroBanners, setHeroBanners] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCategories();
    fetchHeroBanners();
  }, []);
  const fetchHeroBanners = async () => {
    try {
      const response = await bannerService.getActiveBanners();
      const banners = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      const sortedBanners = [...banners].sort(
        (a, b) => (a?.priority ?? 0) - (b?.priority ?? 0)
      );
      setHeroBanners(sortedBanners);
      setActiveBannerIndex(0);
    } catch (error) {
      console.error('Error fetching banner:', error);
      setHeroBanners([]);
      setActiveBannerIndex(0);
    }
  };

  useEffect(() => {
    if (heroBanners.length <= 1) return undefined;

    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % heroBanners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroBanners]);

  const handlePrevBanner = () => {
    if (!heroBanners.length) return;
    setActiveBannerIndex(
      (prev) => (prev - 1 + heroBanners.length) % heroBanners.length
    );
  };

  const handleNextBanner = () => {
    if (!heroBanners.length) return;
    setActiveBannerIndex((prev) => (prev + 1) % heroBanners.length);
  };

  const activeBanner = heroBanners[activeBannerIndex] || null;


  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Try to get featured products first, if none exist, get all products
      let response = await productService.getFeaturedProducts();
      let products = response.data || [];
      
      // Get featured product IDs to avoid duplicates
      const featuredIds = new Set(products.map(p => p._id));
      
      // If we have featured products but less than 8, fill with regular products
      if (products.length > 0 && products.length < 8) {
        const regularResponse = await productService.getAllProducts({ limit: 16 }); // Get more to account for duplicates
        const regularProducts = (regularResponse.data || []).filter(p => !featuredIds.has(p._id));
        products = [...products, ...regularProducts].slice(0, 8);
      } else if (products.length === 0) {
        // If no featured products, get regular products
        response = await productService.getAllProducts({ limit: 8 });
        products = response.data || [];
      } else {
        // If we have 8 or more featured products, just take first 8
        products = products.slice(0, 8);
      }
      
      // Remove any duplicates by ID (safety check)
      const uniqueProducts = [];
      const seenIds = new Set();
      for (const product of products) {
        if (product._id && !seenIds.has(product._id)) {
          seenIds.add(product._id);
          uniqueProducts.push(product);
        }
      }
      
      setFeaturedProducts(uniqueProducts.slice(0, 8));
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
      
      setCategories(dbCategories.length ? dbCategories : fallbackCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories(fallbackCategories);
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
      text: 'I bought a gift set for my wife and she loved it! Beautiful packaging and wonderful aromas.',
      rating: 5,
    },
    {
      name: 'Emma Williams',
      text: 'These are the best handmade candles I have ever purchased. The attention to detail is remarkable.',
      rating: 5,
    },
  ];

  const brandHighlights = [
    {
      title: 'Handcrafted Candles',
      description: 'Hand-poured soy and coconut wax blends infused with phthalate-free oils and layered scent profiles.',
      icon: FiDroplet,
      category: 'Candles',
    },
    {
      title: 'Seasonal Bouquets',
      description: 'Fresh floral arrangements styled with designer wrapping and hydrating techniques for lasting beauty.',
      icon: FiLayers,
      category: 'Bouquets',
    },
    {
      title: 'Custom Gifting',
      description: 'Curated boxes that pair artisanal treats with branded stationery for VIP moments and celebrations.',
      icon: FiPackage,
      category: 'Custom Gifting',
    },
    {
      title: 'Hijabi Essentials',
      description: 'Premium chiffon and jersey hijabs, magnetic pins, and travel-friendly organizers for modern modest wear.',
      icon: FiScissors,
      category: 'Hijabi Essentials',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              `url(${
                activeBanner?.image ||
                'https://images.pexels.com/photos/6101956/pexels-photo-6101956.jpeg?auto=compress&cs=tinysrgb&w=1920'
              })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>

        <motion.div
          key={activeBanner?._id || 'fallback-banner'}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 drop-shadow-lg">
            {activeBanner?.title || 'Handcrafted Candles & Gifts'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-md">
            {activeBanner?.subtitle || 'by Eclora'}
          </p>
          <Link
            to={activeBanner?.ctaLink || '/shop'}
            className="inline-flex items-center space-x-2 bg-primary text-secondary px-8 py-4 rounded-full font-semibold hover:bg-accent hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>{activeBanner?.ctaText || 'Shop Now'}</span>
            <FiArrowRight />
          </Link>
        </motion.div>

        {heroBanners.length > 1 && (
          <>
            <button
              onClick={handlePrevBanner}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/40 transition"
              aria-label="Previous banner"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextBanner}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 text-white p-3 rounded-full hover:bg-white/40 transition"
              aria-label="Next banner"
            >
              <FiChevronRight size={24} />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {heroBanners.map((banner, index) => (
                <button
                  key={banner._id || index}
                  onClick={() => setActiveBannerIndex(index)}
                  className={`w-3 h-3 rounded-full border border-white transition ${
                    index === activeBannerIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                  aria-label={`Show banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
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
            Discover our carefully curated collections of handmade candles, bouquets, and gifting
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
            Our most loved handcrafted candles and curated gifts
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading
            ? Array(8)
                .fill(0)
                .map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
            : featuredProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={`featured-${product._id}-${index}`} product={product} showBuyNow={true} />
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

      {/* Why Eclora - Refined Brand Highlights */}
      <section className="relative py-24 px-4 overflow-hidden bg-[#FFF9F8]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="uppercase tracking-[0.6em] text-accent text-xs font-bold mb-3">
              The Eclora Philosophy
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
              Elevating the Everyday
            </h2>
            <div className="w-24 h-1 bg-accent/30 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              We believe in the beauty of intention. Each Eclora creation is a harmony of traditional artistry and modern elegance, designed to transform your space and soul.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {brandHighlights.map(({ title, description, icon: Icon, category }, index) => (
              <Link
                key={title}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-secondary mb-3">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
                  <span className="text-accent font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    Explore Collection <FiArrowRight />
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* The Eclora Atelier - Redesigned Overlapping Section */}
      <section className="container mx-auto px-4 py-24 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Visual Side with Overlapping Elements */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Main Image */}
            <div className="relative h-[500px] rounded-[40px] overflow-hidden shadow-2xl z-20">
              <img
                src="/assets/images/eclora_atelier.png"
                alt="Eclora Atelier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent"></div>
            </div>

            {/* Overlapping Glass Card */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-10 -right-4 lg:-right-12 z-30 bg-white/60 backdrop-blur-2xl p-8 rounded-[30px] border border-white/80 shadow-2xl max-w-[280px]"
            >
              <p className="text-accent font-bold uppercase tracking-widest text-xs mb-3">Legacy of Craft</p>
              <p className="text-secondary font-heading text-xl font-bold leading-tight">
                "We don't just sell products; we curate moments of serenity."
              </p>
              <p className="text-gray-500 text-sm mt-4 font-medium">— The Eclora Founder</p>
            </motion.div>

            {/* Accent Shapes */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-primary/10 rounded-[50px] -rotate-3 scale-105 -z-10"></div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="space-y-4">
              <p className="uppercase tracking-[0.5em] text-accent text-sm font-bold">The Eclora Atelier</p>
              <h2 className="text-4xl md:text-6xl font-heading font-bold text-secondary leading-tight">
                Crafted with Soul, <br />
                <span className="text-accent italic">Delivered with Love.</span>
              </h2>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Every item in our collection is born from a desire for beauty and a commitment to quality. Whether it's the warm amber glow of our signature candles or the effortless grace of our modest wear, we ensure every detail is perfected for your satisfaction.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
              {[
                { label: 'Artisanal Soul', detail: 'Small batches, timeless techniques.', icon: FiDroplet },
                { label: 'Pure Materials', detail: 'Ethically sourced, toxin-free luxury.', icon: FiFeather },
                { label: 'Bespoke Touch', detail: 'Tailored gifting for VIP moments.', icon: FiGift },
                { label: 'Global Heritage', detail: 'Designs inspired by world travels.', icon: FiShield },
              ].map((item, idx) => (
                <div key={item.label} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-300">
                  <div className="mt-1 text-accent group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-secondary font-bold text-sm uppercase tracking-wide">{item.label}</h4>
                    <p className="text-gray-500 text-sm mt-1">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="inline-flex items-center group gap-3 bg-secondary text-white px-10 py-5 rounded-full font-bold hover:bg-accent transition-all duration-500 shadow-xl hover:shadow-accent/30"
            >
              <span>Our Full Story</span>
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
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

    </div>
  );
};

export default Home;

