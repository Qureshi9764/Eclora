const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedCatalog } = require('./services/catalogSeeder');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const { categoriesSeeded, productsSeeded } = await seedCatalog();
    console.log(`🌿 Categories ensured: ${categoriesSeeded}`);
    console.log(`📦 Products inserted: ${productsSeeded}`);

    console.log('\n✨ Catalog seeding complete! Run `npm run seed` again anytime you want to refresh demo data.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

