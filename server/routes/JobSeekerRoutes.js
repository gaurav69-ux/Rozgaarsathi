const express = require('express');
const router = express.Router();
const jobSeekerController = require('../controllers/jobSeekerController');
const { protect, authorize } = require('../middleware/authMiddleware');
// S3 upload middleware removed

// All routes are protected and for job seekers only
router.get('/profile', protect, authorize('jobseeker'), jobSeekerController.getProfile);
router.post('/profile', protect, authorize('jobseeker'), jobSeekerController.updateProfileDetails);
router.put('/profile', protect, authorize('jobseeker'), jobSeekerController.updateProfile);

// Allow employers to view a jobseeker profile by user id
router.get('/:userId/profile', protect, authorize('employer'), jobSeekerController.getProfileByUserId);

module.exports = router;