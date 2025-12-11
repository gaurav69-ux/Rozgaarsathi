const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: [true, 'Job title is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Job description is required']
  },
  requirements: { 
    type: String 
  },
  category: { 
    type: String,
    trim: true
  },
  jobType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'remote', 'contract'], 
    required: true 
  },
  salary: {
    min: Number,
    max: Number,
    currency: { 
      type: String, 
      default: 'USD' 
    }
  },
  location: { 
    type: String,
    trim: true
  },
  experienceLevel: { 
    type: String,
    trim: true
  },
  postedDate: { 
    type: Date, 
    default: Date.now 
  },
  deadline: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['active', 'closed'], 
    default: 'active' 
  }
}, { 
  timestamps: true 
});

// Index for search optimization
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);