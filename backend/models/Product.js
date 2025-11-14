const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    brand: {
      type: String,
      default: 'Eclora',
    },
    image: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);

