const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Job Seeker only)
exports.applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if job is active
    if (job.status !== 'active') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Create application (resume is optional)
    const application = await Application.create({
      jobId,
      jobSeekerId: req.user.id,
      resume: req.file ? req.file.path : null,
      coverLetter
    });

    // Populate job and user details
    await application.populate('jobId', 'title company');

    res.status(201).json({ 
      success: true,
      message: 'Application submitted successfully', 
      application 
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my applications (for job seeker)
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobSeekerId: req.user.id })
      .populate({
        path: 'jobId',
        populate: { path: 'employerId', select: 'name email' }
      })
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get applications for a specific job (for employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // validate jobId is a valid ObjectId
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    // Verify job exists and belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    // Get all applications for this job
    const applications = await Application.find({ jobId })
      .populate('jobSeekerId', 'name email phone')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      jobTitle: job.title,
      applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['applied', 'under_review', 'shortlisted', 'rejected', 'accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the job belongs to the employer
    if (application.jobId.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();

    res.json({ 
      success: true,
      message: 'Application status updated successfully', 
      application 
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all applications for employer's jobs
// @route   GET /api/applications/job/all
// @access  Private (Employer only)
exports.getApplicationsForEmployer = async (req, res) => {
  try {
    // Find jobs that belong to this employer
    const jobs = await Job.find({ employerId: req.user.id }).select('_id title');
    const jobIds = jobs.map(j => j._id);

    // Fetch applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title')
      .populate('jobSeekerId', 'name email')
      .sort({ appliedDate: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get employer applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};