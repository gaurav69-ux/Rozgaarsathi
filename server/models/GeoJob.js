const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    employerName: {
        type: String,
        required: true,
        trim: true
    },
    shopName: {
        type: String,
        required: true,
        trim: true
    },
    jobTypeNeeded: {
        type: String,
        required: true,
        trim: true
    },
    pay: {
        type: Number,
        required: true
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Add 2dsphere index on location field
jobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('GeoJob', jobSchema);
