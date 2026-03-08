const express = require('express');
const router = express.Router();
const employerController = require('../controllers/EmployerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// All routes are protected and for employers only
router.get('/profile', protect, authorize('employer'), employerController.getProfile);
router.put('/profile', protect, authorize('employer'), employerController.updateProfile);
router.get('/my-jobs', protect, authorize('employer'), employerController.getMyJobs);

module.exports = router;