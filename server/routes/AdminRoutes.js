const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const { protect, authorize } = require('../middleware/authMiddleware');


// Dashboard stats route
router.get('/stats', protect, authorize('admin'), adminController.getDashboardStats);

// All applications (for admin)
router.get('/applications', protect, authorize('admin'), adminController.getAllApplications);

// User management
router.get('/users', protect, authorize('admin'), adminController.getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);

module.exports = router;
