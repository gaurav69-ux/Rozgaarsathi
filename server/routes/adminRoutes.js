const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Dashboard stats route
router.get('/stats', protect, authorize('admin'), adminController.getDashboardStats);

module.exports = router;
