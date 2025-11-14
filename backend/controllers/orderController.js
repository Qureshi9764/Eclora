const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
  try {
    const { 
      userId, 
      products, 
      shippingAddress, 
      email, 
      phone, 
      totalAmount, 
      stripeSessionId,
      paymentStatus,
      orderStatus 
    } = req.body;

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide products in the order',
      });
    }

    if (!email || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and total amount',
      });
    }

    // Validate products and update stock
    for (const item of products) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId,
      products,
      shippingAddress,
      email,
      phone,
      totalAmount,
      stripeSessionId: stripeSessionId || `order-${Date.now()}`,
      paymentStatus: paymentStatus || 'pending',
      orderStatus: orderStatus || 'pending',
    });

    // Populate for response
    await order.populate('userId', 'name email');
    await order.populate('products.productId', 'name image images');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/:userId
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('products.productId', 'name images');

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('products.productId', 'name image images');

    // Transform orders to match admin panel expectations
    const transformedOrders = orders.map(order => ({
      _id: order._id,
      user: order.userId ? {
        _id: order.userId._id,
        name: order.userId.name,
        email: order.userId.email,
      } : null,
      items: order.products.map(item => ({
        product: item.productId ? {
          _id: item.productId._id,
          name: item.productId.name,
          image: item.productId.image || item.productId.images?.[0] || '',
        } : { name: item.name },
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: order.shippingAddress,
      subtotal: order.totalAmount,
      shippingCost: 0,
      discount: 0,
      totalAmount: order.totalAmount,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus === 'paid' ? 'Paid' : 'Pending',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: transformedOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('products.productId', 'name image images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Handle both 'status' and 'orderStatus' field names
    if (status) order.orderStatus = status;
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    // Transform for admin panel
    const transformedOrder = {
      _id: order._id,
      user: order.userId ? {
        _id: order.userId._id,
        name: order.userId.name,
        email: order.userId.email,
      } : null,
      items: order.products.map(item => ({
        product: item.productId ? {
          _id: item.productId._id,
          name: item.productId.name,
          image: item.productId.image || item.productId.images?.[0] || '',
        } : { name: item.name },
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: order.shippingAddress,
      totalAmount: order.totalAmount,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus === 'paid' ? 'Paid' : 'Pending',
      createdAt: order.createdAt,
    };

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: transformedOrder,
    });
  } catch (error) {
    next(error);
  }
};

