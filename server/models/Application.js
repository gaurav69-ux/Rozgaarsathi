const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  jobSeekerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  resume: { 
    type: String, 
    required: true 
  },
  coverLetter: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['applied', 'under_review', 'shortlisted', 'rejected', 'accepted'],
    default: 'applied'
  },
  appliedDate: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);