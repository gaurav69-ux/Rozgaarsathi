const EmployerProfile = require('../models/EmployerProfile');
const Job = require('../models/Job');

// @desc    Get employer profile
// @route   GET /api/employer/profile
// @access  Private (Employer only)
exports.getProfile = async (req, res) => {
  try {
    const profile = await EmployerProfile.findOne({ userId: req.user.id });
    
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
    const { companyName, website, description, location, industry } = req.body;
    
    const updateData = {
      companyName,
      website,
      description,
      location,
      industry
    };

    // Handle company logo upload
    if (req.file) {
      updateData.companyLogo = req.file.path;
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
    
    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};