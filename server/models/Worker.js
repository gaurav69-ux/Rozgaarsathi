const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  availableUntil: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Add 2dsphere index on location field
workerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Worker', workerSchema);
