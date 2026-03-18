// @desc    Get all applications (excluding those for jobs removed by admin)
// @route   GET /api/admin/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
    try {
        // Exclude applications for jobs removed by admin
        const removedJobIds = (await Job.find({ removedByAdmin: true }, '_id')).map(j => j._id);
        const query = removedJobIds.length ? { jobId: { $nin: removedJobIds } } : {};

        const applications = await Application.find(query)
            .populate('jobId', 'title')
            .populate('jobSeekerId', 'name email')
            .sort({ createdAt: -1 });

        const result = applications.map(app => ({
            _id: app._id,
            jobTitle: app.jobId?.title || 'Deleted Job',
            applicantName: app.jobSeekerId?.name || 'Unknown',
            applicantEmail: app.jobSeekerId?.email || 'Unknown',
            createdAt: app.createdAt
        }));

        res.json({ success: true, applications: result });
    } catch (error) {
        console.error('Admin get all applications error:', error);
        res.status(500).json({ message: 'Server error fetching applications', error: error.message });
    }
};
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

        // Job counts (exclude removed by admin)
        const totalJobs = await Job.countDocuments({ removedByAdmin: { $ne: true } });
        const activeJobs = await Job.countDocuments({ status: 'open', removedByAdmin: { $ne: true } });

        // Application counts (exclude those for jobs removed by admin)
        const removedJobIds = (await Job.find({ removedByAdmin: true }, '_id')).map(j => j._id);
        const totalApplications = await Application.countDocuments(removedJobIds.length ? { jobId: { $nin: removedJobIds } } : {});

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
