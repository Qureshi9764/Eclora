import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000,
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const brands = ['All', 'Eclora Signature', 'Botanical Bliss', 'Pure Essence'];

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      const dbCategories = response.data || response || [];
      const categoryNames = ['All', ...dbCategories.map((cat) => cat.name)];
      setCategories(categoryNames);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      setCategories(['All', 'Candles', 'Floral Fragrance', 'Gift Sets', 'Home Decor']);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...(filters.category && filters.category !== 'All' && { category: filters.category }),
        ...(filters.brand && filters.brand !== 'All' && { brand: filters.brand }),
        ...(filters.search && { search: filters.search }),
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      };
      const response = await productService.getAllProducts(params);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'category') {
      setSearchParams(value && value !== 'All' ? { category: value } : {});
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 1000,
      search: '',
    });
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold text-secondary mb-4">Shop</h1>
        <p className="text-gray-600">Explore our complete collection of handcrafted candles and fragrances</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-white px-8 py-3 rounded-lg hover:bg-primary hover:text-secondary transition-colors font-semibold"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden bg-secondary text-white px-8 py-3 rounded-lg hover:bg-accent transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <FiFilter />
            <span>Filters</span>
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}
        >
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-bold text-secondary">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-accent hover:text-primary transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-text mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category || (category === 'All' && !filters.category)}
                      onChange={() => handleFilterChange('category', category === 'All' ? '' : category)}
                      className="text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-text mb-3">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      checked={filters.brand === brand || (brand === 'All' && !filters.brand)}
                      onChange={() => handleFilterChange('brand', brand === 'All' ? '' : brand)}
                      className="text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold text-text mb-3">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Min: ${filters.minPrice}</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Max: ${filters.maxPrice}</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                    className="w-full accent-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${products.length} products found`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-accent hover:text-primary transition-colors font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;

