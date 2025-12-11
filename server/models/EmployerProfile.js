const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  companyLogo: {
    type: String,
  },
  website: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EmployerProfile', employerProfileSchema);