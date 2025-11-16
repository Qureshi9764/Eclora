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

      {/* Brand Highlights */}
      <section className="bg-gradient-to-r from-primary/10 via-white to-primary/10 py-20 px-4 overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="uppercase tracking-[0.5em] text-accent text-sm mb-2">
              The Eclora Promise
            </p>
            <h2 className="text-4xl font-heading font-bold text-secondary">
              Why Customers Love Our Atelier
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mt-4">
              From hand-poured candles to seasonal bouquets, custom gift boxes, and premium modest wear essentials—we craft each collection with attention to detail, quality materials, and thoughtful design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandHighlights.map(({ title, description, icon: Icon, category }, index) => (
              <Link
                key={title}
                to={`/shop?category=${encodeURIComponent(category)}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur border border-primary/10 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition cursor-pointer h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/15 text-accent flex items-center justify-center mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Craft Story */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[420px] rounded-3xl overflow-hidden shadow-lg"
          >
            <img
              src="https://images.pexels.com/photos/545012/pexels-photo-545012.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Artisan pouring candle wax"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/80 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white max-w-xs">
              <p className="uppercase text-sm tracking-[0.3em] mb-2">Inside The Studio</p>
              <p className="text-2xl font-heading font-semibold leading-snug">
                Every product is carefully crafted with attention to detail, quality, and your satisfaction.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="uppercase tracking-[0.4em] text-accent text-sm">Crafted With Care</p>
            <h2 className="text-4xl font-heading font-bold text-secondary">
              From Our Studio To Your Home
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Whether it's hand-poured candles with layered scents, seasonal bouquets arranged with care, thoughtfully curated gift boxes, or premium modest wear essentials—each product is crafted with attention to quality, sustainability, and meaningful design.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Handcrafted Quality', detail: 'Small-batch, never mass-produced' },
                { label: 'Premium Materials', detail: 'Ethically sourced and sustainable' },
                { label: 'Thoughtful Design', detail: 'Curated for modern living' },
                { label: 'Custom Options', detail: 'Corporate + personal gifting' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl border border-primary/15 bg-white">
                  <p className="text-sm uppercase tracking-wide text-accent font-semibold">{item.label}</p>
                  <p className="text-secondary font-medium mt-1">{item.detail}</p>
                </div>
              ))}
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:text-primary transition"
            >
              Discover our story
              <FiArrowRight />
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

