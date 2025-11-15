const Category = require('../models/Category');
const Product = require('../models/Product');
const { categorySeeds, productSeeds } = require('../data/catalogSeedData');

const seedCatalog = async () => {
  const categoryMap = {};

  for (const category of categorySeeds) {
    const upserted = await Category.findOneAndUpdate(
      { name: category.name },
      category,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    categoryMap[category.name] = upserted._id;
  }

  const categoryIds = Object.values(categoryMap);
  await Product.deleteMany({ category: { $in: categoryIds } });

  const preparedProducts = productSeeds
    .map(({ categoryName, ...product }) => {
      const categoryId = categoryMap[categoryName];
      if (!categoryId) {
        return null;
      }
      return {
        ...product,
        category: categoryId,
        image: product.images?.[0] || '',
        status: 'active',
        isActive: true,
      };
    })
    .filter(Boolean);

  const products = await Product.insertMany(preparedProducts);

  return {
    categoriesSeeded: Object.keys(categoryMap).length,
    productsSeeded: products.length,
  };
};

module.exports = {
  seedCatalog,
};

