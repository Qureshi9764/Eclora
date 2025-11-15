const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const cloudinary = require('../utils/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      product,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    // Build query
    let query = {};

    // For admin panel, show all products
    // For website, only show active products
    if (!req.user || req.user.role !== 'admin') {
      query.isActive = true;
    }

    // Handle category - can be name or ID
    if (category) {
      // Check if it's a valid ObjectId
      const Category = require('../models/Category');
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        // It's a name, find the category ID
        const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        } else {
          // Category name not found, return empty results
          return res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: [],
            pagination: {
              page: Number(page),
              limit: Number(limit),
              total: 0,
              pages: 0,
            },
          });
        }
      }
    }

    if (brand) {
      query.brand = brand;
    }

    if (product) {
      query.name = { $regex: new RegExp(`^${product}$`, 'i') };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (featured) {
      query.featured = true;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name description')
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, brand, stock, image, images, isActive, featured } = req.body;

    // Validate required fields
    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, category, price',
      });
    }

    // Handle image - support both single image and images array
    let imageUrls = [];
    if (image) {
      imageUrls = [image];
    } else if (images && Array.isArray(images)) {
      imageUrls = images;
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      brand: brand || 'Eclora',
      stock: stock !== undefined ? Number(stock) : 0,
      image: image || '',
      images: imageUrls,
      isActive: isActive !== false,
      status: isActive !== false ? 'active' : 'inactive',
      featured: featured === true,
    };

    const product = await Product.create(productData);
    
    // Populate category before sending response
    await product.populate('category', 'name description');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Handle isActive to status conversion
    const updateData = { ...req.body };
    if (updateData.isActive !== undefined) {
      updateData.status = updateData.isActive ? 'active' : 'inactive';
    }

    // Handle single image to images array
    if (updateData.image && !updateData.images) {
      updateData.images = [updateData.image];
    }
    
    // Handle featured field
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === true;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('category', 'name description');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

