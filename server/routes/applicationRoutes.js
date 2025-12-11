const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Job Seeker routes
router.post('/', protect, authorize('jobseeker'), upload.single('resume'), applicationController.applyJob);
router.get('/my-applications', protect, authorize('jobseeker'), applicationController.getMyApplications);

// Employer routes
router.get('/job/:jobId', protect, authorize('employer'), applicationController.getJobApplications);
router.put('/:id/status', protect, authorize('employer'), applicationController.updateApplicationStatus);

module.exports = router;