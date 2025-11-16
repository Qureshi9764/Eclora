const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Method to add or update product in cart
cartSchema.methods.addProduct = function (productId, quantity = 1) {
  const existingItem = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({ product: productId, quantity });
  }
  
  return this.save();
};

// Method to update product quantity
cartSchema.methods.updateQuantity = function (productId, quantity) {
  const item = this.items.find(
    (item) => item.product.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(
        (item) => item.product.toString() !== productId.toString()
      );
    } else {
      item.quantity = quantity;
    }
  }
  
  return this.save();
};

// Method to remove product from cart
cartSchema.methods.removeProduct = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);

