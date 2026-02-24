const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        // User counts
        const totalUsers = await User.countDocuments();
        const jobseekersCount = await User.countDocuments({ role: 'jobseeker' });
        const employersCount = await User.countDocuments({ role: 'employer' });
        const adminsCount = await User.countDocuments({ role: 'admin' });

        // Job counts
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'open' });

        // Application counts
        const totalApplications = await Application.countDocuments();

        // Recent registrations (last 5)
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    jobseekers: jobseekersCount,
                    employers: employersCount,
                    admins: adminsCount
                },
                jobs: {
                    total: totalJobs,
                    active: activeJobs
                },
                applications: {
                    total: totalApplications
                }
            },
            recentUsers
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server error fetching admin stats', error: error.message });
    }
};
