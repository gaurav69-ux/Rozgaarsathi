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

// @desc    Update job seeker profile with personal details and photo
// @route   POST /api/jobseeker/profile
// @access  Private (Job Seeker only)
exports.updateProfileDetails = async (req, res) => {
  try {
    const { name, email, address, age, about } = req.body;
    
    const updateData = {
      name: name || undefined,
      email: email || undefined,
      address: address || undefined,
      age: age || undefined,
      about: about || undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    // Handle profile photo upload
    if (req.file) {
      updateData.profilePhoto = req.file.path;
    }

    // Find or create profile
    let profile = await JobSeekerProfile.findOne({ userId: req.user.id });

    if (!profile) {
      // Create new profile
      updateData.userId = req.user.id;
      profile = await JobSeekerProfile.create(updateData);
    } else {
      // Update existing profile
      profile = await JobSeekerProfile.findOneAndUpdate(
        { userId: req.user.id },
        updateData,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      ...profile.toObject()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job seeker profile (skills, experience, education)
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