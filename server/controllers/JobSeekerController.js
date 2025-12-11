const JobSeekerProfile = require('../models/JobSeekerProfile');

// @desc    Get job seeker profile
// @route   GET /api/jobseeker/profile
// @access  Private (Job Seeker only)
exports.getProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id })
      .populate('savedJobs');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job seeker profile
// @route   PUT /api/jobseeker/profile
// @access  Private (Job Seeker only)
exports.updateProfile = async (req, res) => {
  try {
    const { skills, experience, education } = req.body;
    
    const updateData = {};
    
    // Handle JSON string fields
    if (skills) {
      updateData.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }
    if (experience) {
      updateData.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
    }
    if (education) {
      updateData.education = typeof education === 'string' ? JSON.parse(education) : education;
    }

    // Handle resume file upload
    if (req.file) {
      updateData.resume = req.file.path;
    }

    const profile = await JobSeekerProfile.findOneAndUpdate(
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
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};