const express = require('express');
const router = express.Router();
const jobSeekerController = require('../controllers/JobSeekerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/s3UploadMiddleware');

// All routes are protected and for job seekers only
router.get('/profile', protect, authorize('jobseeker'), jobSeekerController.getProfile);
router.post('/profile', protect, authorize('jobseeker'), upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), jobSeekerController.updateProfileDetails);
router.put('/profile', protect, authorize('jobseeker'), upload.single('resume'), jobSeekerController.updateProfile);

// Allow employers to view a jobseeker profile by user id
router.get('/:userId/profile', protect, authorize('employer'), jobSeekerController.getProfileByUserId);

module.exports = router;