const mongoose = require('mongoose');

const jobSeekerProfileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  resume: { 
    type: String 
  },
  skills: [{ 
    type: String 
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  savedJobs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job' 
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('JobSeekerProfile', jobSeekerProfileSchema);