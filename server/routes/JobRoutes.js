const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

// Protected routes - Employer only
router.post('/', protect, authorize('employer'), jobController.createJob);
router.put('/:id', protect, authorize('employer'), jobController.updateJob);
router.delete('/:id', protect, authorize('employer'), jobController.deleteJob);

// Protected routes - Job Seeker only
router.post('/:id/save', protect, authorize('jobseeker'), jobController.saveJob);

module.exports = router;