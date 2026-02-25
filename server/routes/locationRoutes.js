const express = require('express');
const router = express.Router();
const Worker = require('../models/worker');
const GeoJob = require('../models/geoJob');

/**
 * @route   GET /api/location/workers/nearby
 * @desc    Get nearby workers within dynamic radius (default 5km)
 * @query   lat, lng, jobType, radius
 */
router.get('/workers/nearby', async (req, res) => {
    try {
        const { lat, lng, jobType, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const maxDist = radius ? parseFloat(radius) * 1000 : 5000; // Default to 5km if not specified

        // MongoDB GeoJSON uses [longitude, latitude]
        const nearbyWorkers = await Worker.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [longitude, latitude] },
                    distanceField: "distance",
                    maxDistance: maxDist, // 5000 meters = 5km
                    query: {
                        isAvailable: true,
                        availableUntil: { $gt: new Date() },
                        ...(jobType && { jobType })
                    },
                    spherical: true
                }
            },
            {
                $sort: { distance: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: nearbyWorkers.length,
            radiusLimit: maxDist,
            data: nearbyWorkers
        });
    } catch (error) {
        console.error('Error fetching nearby workers:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

/**
 * @route   GET /api/location/jobs/nearby
 * @desc    Get nearby jobs within dynamic radius (default 5km)
 * @query   lat, lng, radius
 */
router.get('/jobs/nearby', async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const maxDist = radius ? parseFloat(radius) * 1000 : 5000;

        const nearbyJobs = await GeoJob.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [longitude, latitude] },
                    distanceField: "distance",
                    maxDistance: maxDist,
                    query: {
                        expiresAt: { $gt: new Date() }
                    },
                    spherical: true
                }
            },
            {
                $sort: { distance: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: nearbyJobs.length,
            radiusLimit: maxDist,
            data: nearbyJobs
        });
    } catch (error) {
        console.error('Error fetching nearby jobs:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
