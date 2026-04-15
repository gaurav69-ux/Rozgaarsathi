const Job = require('../models/Job');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const EmployerProfile = require('../models/EmployerProfile');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = async (req, res) => {
  try {
    const {
      title,
      location,
      category,
      jobType,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { status: 'active', removedByAdmin: { $ne: true } };

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (jobType) {
      query.jobType = jobType;
    }
    if (minSalary) {
      query['salary.min'] = { $gte: Number(minSalary) };
    }
    if (maxSalary) {
      query['salary.max'] = { $lte: Number(maxSalary) };
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .populate('employerId', 'name email')
      .sort({ postedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const count = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employerId', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = async (req, res) => {
  try {
    // Fetch employer profile for company name
    const profile = await EmployerProfile.findOne({ userId: req.user.id });

    const jobData = {
      ...req.body,
      employerId: req.user.id,
      companyName: profile ? profile.companyName : 'Independent Employer'
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the owner
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId', 'email name');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Allow admin or employer (owner) to delete
    let deletedBy = 'employer';
    if (req.user.role === 'admin') {
      deletedBy = 'admin';
      // Soft delete: mark as removed by admin
      job.removedByAdmin = true;
      job.removedReason = 'This job was removed by an administrator.';
      await job.save();
    } else if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    } else {
      // Employer hard delete
      await Job.findByIdAndDelete(req.params.id);
    }

    // TODO: Optionally, send email/notification to employer here

    res.json({
      success: true,
      message: deletedBy === 'admin' ? 'Job deleted by admin. Employer will be notified.' : 'Job deleted successfully',
      deletedBy,
      employer: job.employerId ? { email: job.employerId.email, name: job.employerId.name } : null,
      jobTitle: job.title
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Save/Unsave job (bookmark)
// @route   POST /api/jobs/:id/save
// @access  Private (Job Seeker only)
exports.saveJob = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const jobId = req.params.id;
    const isSaved = profile.savedJobs.includes(jobId);

    if (isSaved) {
      // Remove from saved jobs
      profile.savedJobs = profile.savedJobs.filter(id => id.toString() !== jobId);
      await profile.save();

      return res.json({
        success: true,
        message: 'Job removed from saved list',
        saved: false
      });
    }

    // Add to saved jobs
    profile.savedJobs.push(jobId);
    await profile.save();

    res.json({
      success: true,
      message: 'Job saved successfully',
      saved: true
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};