const EmployerProfile = require('../models/EmployerProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get employer profile
// @route   GET /api/employer/profile
// @access  Private (Employer only)
exports.getProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ userId: req.user.id }).populate('userId', 'name email phone');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get employer profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update employer profile
// @route   PUT /api/employer/profile
// @access  Private (Employer only)
exports.updateProfile = async (req, res) => {
  try {
    const { companyName, website, description, location, industry, name, phone } = req.body;

    // Update User details if provided
    if (name || phone) {
      const userUpdateData = {};
      if (name) userUpdateData.name = name;
      if (phone) userUpdateData.phone = phone;

      await User.findByIdAndUpdate(req.user.id, userUpdateData);
    }

    const updateData = {
      companyName,
      website,
      description,
      location,
      industry
    };

    // Handle company logo upload
    if (req.file) {
      updateData.companyLogo = req.file.location;
    }

    const profile = await EmployerProfile.findOneAndUpdate(
      { userId: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update employer profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get employer's posted jobs
// @route   GET /api/employer/my-jobs
// @access  Private (Employer only)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id })
      .sort({ postedDate: -1 });

    // Aggregate application counts for these jobs
    const jobIds = jobs.map(j => j._id);
    const counts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } }
    ]);

    const countsMap = {};
    counts.forEach(c => { countsMap[c._id.toString()] = c.count; });

    const jobsWithCounts = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.applicationCount = countsMap[job._id.toString()] || 0;
      return jobObj;
    });

    res.json({
      success: true,
      count: jobsWithCounts.length,
      jobs: jobsWithCounts
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};