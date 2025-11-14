const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Product images from reliable CDN sources
const dummyProducts = [
  // Candles Category
  {
    name: 'Lavender Dreams Candle',
    description: 'Indulge in the calming aroma of pure lavender essential oils. Hand-poured with natural soy wax for a clean, long-lasting burn. Perfect for relaxation and meditation.',
    category: 'Candles',
    price: 24.99,
    brand: 'Eclora Signature',
    stock: 50,
    images: [
      'https://images.pexels.com/photos/6101956/pexels-photo-6101956.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: true,
  },
  {
    name: 'Vanilla Bliss Candle',
    description: 'Experience the warm, sweet embrace of Madagascar vanilla. Crafted with premium ingredients for a luxurious ambiance in any room.',
    category: 'Candles',
    price: 22.99,
    brand: 'Eclora Signature',
    stock: 45,
    images: [
      'https://images.pexels.com/photos/5490966/pexels-photo-5490966.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6101966/pexels-photo-6101966.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: true,
  },
  {
    name: 'Ocean Breeze Candle',
    description: 'Transport yourself to a coastal paradise with this refreshing blend of sea salt, jasmine, and marine notes. Perfect for creating a spa-like atmosphere.',
    category: 'Candles',
    price: 26.99,
    brand: 'Botanical Bliss',
    stock: 35,
    images: [
      'https://images.pexels.com/photos/7496374/pexels-photo-7496374.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6786735/pexels-photo-6786735.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: true,
  },
  {
    name: 'Cinnamon Spice Candle',
    description: 'Warm your home with the inviting scent of cinnamon, clove, and nutmeg. Perfect for cozy autumn evenings and holiday gatherings.',
    category: 'Candles',
    price: 23.99,
    brand: 'Pure Essence',
    stock: 40,
    images: [
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7496361/pexels-photo-7496361.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: true,
  },
  {
    name: 'Rose Garden Candle',
    description: 'Delight in the romantic fragrance of fresh-cut roses blended with soft petals. Hand-crafted for a sophisticated and elegant atmosphere.',
    category: 'Candles',
    price: 28.99,
    brand: 'Eclora Signature',
    stock: 30,
    images: [
      'https://images.pexels.com/photos/3015912/pexels-photo-3015912.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6102042/pexels-photo-6102042.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: false,
  },
  {
    name: 'Eucalyptus Mint Candle',
    description: 'Refresh your senses with this invigorating blend of eucalyptus and peppermint. Ideal for focus and clarity.',
    category: 'Candles',
    price: 25.99,
    brand: 'Botanical Bliss',
    stock: 38,
    images: [
      'https://images.pexels.com/photos/7496356/pexels-photo-7496356.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5490961/pexels-photo-5490961.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: false,
  },

  // Floral Fragrance Category
  {
    name: 'Cherry Blossom Reed Diffuser',
    description: 'Enjoy continuous fragrance with this elegant reed diffuser featuring delicate cherry blossom notes. Lasts up to 3 months.',
    category: 'Floral Fragrance',
    price: 32.99,
    brand: 'Botanical Bliss',
    stock: 25,
    images: [
      'https://images.pexels.com/photos/5490918/pexels-photo-5490918.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7496370/pexels-photo-7496370.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: true,
  },
  {
    name: 'Jasmine Night Room Spray',
    description: 'Instantly refresh any space with our premium jasmine room spray. Made with natural essential oils for a long-lasting scent.',
    category: 'Floral Fragrance',
    price: 18.99,
    brand: 'Pure Essence',
    stock: 60,
    images: [
      'https://images.pexels.com/photos/4041401/pexels-photo-4041401.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: true,
  },
  {
    name: 'Peony & Blush Diffuser',
    description: 'Transform your home with the sophisticated scent of peony petals and blush suede. A luxurious floral experience.',
    category: 'Floral Fragrance',
    price: 34.99,
    brand: 'Eclora Signature',
    stock: 20,
    images: [
      'https://images.pexels.com/photos/6102036/pexels-photo-6102036.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7496376/pexels-photo-7496376.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: false,
  },
  {
    name: 'Magnolia Bloom Essence',
    description: 'Capture the essence of southern magnolia blossoms. A fresh, clean floral fragrance perfect for spring.',
    category: 'Floral Fragrance',
    price: 29.99,
    brand: 'Botanical Bliss',
    stock: 28,
    images: [
      'https://images.pexels.com/photos/5490916/pexels-photo-5490916.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6101975/pexels-photo-6101975.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: false,
  },

  // Gift Sets Category
  {
    name: 'Luxury Spa Collection',
    description: 'Pamper yourself or someone special with this luxurious spa set featuring 3 candles, 1 reed diffuser, and bath salts in a beautiful gift box.',
    category: 'Gift Sets',
    price: 89.99,
    brand: 'Eclora Signature',
    stock: 15,
    images: [
      'https://images.pexels.com/photos/5624103/pexels-photo-5624103.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6101952/pexels-photo-6101952.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: true,
  },
  {
    name: 'Romance Gift Set',
    description: 'Set the mood with this romantic collection featuring rose and vanilla candles, perfect for anniversaries and special occasions.',
    category: 'Gift Sets',
    price: 64.99,
    brand: 'Eclora Signature',
    stock: 22,
    images: [
      'https://images.pexels.com/photos/6102038/pexels-photo-6102038.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5624103/pexels-photo-5624103.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: true,
  },
  {
    name: 'Seasonal Celebration Set',
    description: 'Celebrate the holidays with this festive collection of 4 scented candles in seasonal fragrances. Beautifully wrapped and ready to gift.',
    category: 'Gift Sets',
    price: 72.99,
    brand: 'Eclora Signature',
    stock: 18,
    images: [
      'https://images.pexels.com/photos/264985/pexels-photo-264985.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5624098/pexels-photo-5624098.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: false,
  },

  // Home Decor Category
  {
    name: 'Crystal Candle Holder',
    description: 'Elegant crystal glass candle holder that adds sparkle and sophistication to any room. Fits standard pillar candles.',
    category: 'Home Decor',
    price: 34.99,
    brand: 'Eclora Signature',
    stock: 32,
    images: [
      'https://images.pexels.com/photos/5848861/pexels-photo-5848861.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6101954/pexels-photo-6101954.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: false,
  },
  {
    name: 'Ceramic Diffuser Set',
    description: 'Beautiful handmade ceramic diffuser with geometric patterns. Includes 6 premium rattan reeds and essential oil blend.',
    category: 'Home Decor',
    price: 42.99,
    brand: 'Pure Essence',
    stock: 16,
    images: [
      'https://images.pexels.com/photos/7496368/pexels-photo-7496368.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5490918/pexels-photo-5490918.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: false,
  },
  {
    name: 'Vintage Brass Candle Tray',
    description: 'Antique-inspired brass tray perfect for displaying your favorite candles. Adds a touch of vintage elegance to any space.',
    category: 'Home Decor',
    price: 38.99,
    brand: 'Eclora Signature',
    stock: 24,
    images: [
      'https://images.pexels.com/photos/3015912/pexels-photo-3015912.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6101966/pexels-photo-6101966.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    status: 'active',
    featured: false,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert dummy products
    const products = await Product.insertMany(dummyProducts);
    console.log(`✅ Successfully added ${products.length} products`);

    console.log('\n📦 Sample Products:');
    products.slice(0, 3).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    console.log('\n✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

