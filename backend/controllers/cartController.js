const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      model: 'Product',
      populate: {
        path: 'category',
        model: 'Category',
      },
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Format response to match frontend expectations
    const items = cart.items.map((item) => {
      const product = item.product;
      return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        images: product.images,
        category: product.category,
        stock: product.stock,
        brand: product.brand,
        isActive: product.isActive,
        featured: product.featured,
        quantity: item.quantity,
      };
    });

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: {
        items,
        totalItems,
        totalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a product ID',
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate and return updated cart
    await cart.populate({
      path: 'items.product',
      model: 'Product',
      populate: {
        path: 'category',
        model: 'Category',
      },
    });

    const cartItem = cart.items.find(
      (item) => item.product._id.toString() === productId.toString()
    );

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: {
        _id: cartItem.product._id,
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
        image: cartItem.product.image,
        images: cartItem.product.images,
        category: cartItem.product.category,
        stock: cartItem.product.stock,
        brand: cartItem.product.brand,
        isActive: cartItem.product.isActive,
        featured: cartItem.product.featured,
        quantity: cartItem.quantity,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Check product stock if increasing quantity
    if (quantity > 0) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock`,
        });
      }
    }

    // Update quantity
    await cart.updateQuantity(productId, quantity);

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: { productId, quantity },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Remove product from cart
    await cart.removeProduct(productId);

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: { productId },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.clearCart();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};

