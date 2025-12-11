const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes are protected and for employers only
router.get('/profile', protect, authorize('employer'), employerController.getProfile);
router.put('/profile', protect, authorize('employer'), upload.single('companyLogo'), employerController.updateProfile);
router.get('/my-jobs', protect, authorize('employer'), employerController.getMyJobs);

module.exports = router;