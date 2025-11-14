const express = require('express');
const router = express.Router();
const {
  getAllBanners,
  getAllBannersAdmin,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllBannersAdmin); // Changed to show all for admin
router.get('/:id', getBannerById);

// Admin routes
router.post('/', protect, admin, createBanner);
router.put('/:id', protect, admin, updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

module.exports = router;

