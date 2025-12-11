const express = require('express');
const router = express.Router();
const jobSeekerController = require('../controllers/JobSeekerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes are protected and for job seekers only
router.get('/profile', protect, authorize('jobseeker'), jobSeekerController.getProfile);
router.put('/profile', protect, authorize('jobseeker'), upload.single('resume'), jobSeekerController.updateProfile);

module.exports = router;