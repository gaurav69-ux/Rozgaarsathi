import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Shield, UserPlus } from 'lucide-react';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';
import AdminJobsList from './AdminJobsList';
import AdminApplicationsList from './AdminApplicationsList';
import AdminUsersList from './AdminUsersList';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showJobs, setShowJobs] = useState(false);
    const [showApplications, setShowApplications] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data.stats);
                setRecentUsers(res.data.recentUsers);
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <>
                <Background />
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-blue-600 text-xl font-medium animate-pulse">Loading Admin Dashboard...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Background />
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-red-400 text-xl">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Background />
            <Navbar />
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">
                        Admin Dashboard
                    </h1>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
                        <Shield className="w-5 h-5" />
                        <span className="font-semibold">System Administrator</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* User Stats - clickable */}
                    <div
                        className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all shadow-sm"
                        onClick={() => setShowUsers(true)}
                        title="Click to view all users"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-8 h-8 text-blue-500" />
                            <span className="text-3xl font-bold text-gray-900">{stats.users.total}</span>
                        </div>
                        <div className="text-gray-600 font-medium">Total Users</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {stats.users.jobseekers} Jobseekers • {stats.users.employers} Employers
                        </div>
                    </div>
                    {/* Modal/Section for all users */}
                    {showUsers && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-8 max-w-4xl w-full relative max-h-[90vh] overflow-hidden flex flex-col">
                                <button
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
                                    onClick={() => setShowUsers(false)}
                                    title="Close"
                                >
                                    &times;
                                </button>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Users</h2>
                                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    <AdminUsersList />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Stats - clickable */}
                    <div
                        className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all shadow-sm"
                        onClick={() => setShowJobs(true)}
                        title="Click to view all jobs"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Briefcase className="w-8 h-8 text-blue-500" />
                            <span className="text-3xl font-bold text-gray-900">{stats.jobs.total}</span>
                        </div>
                        <div className="text-gray-600 font-medium">Total Jobs</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {stats.jobs.active} Active Postings
                        </div>
                    </div>
                    {/* Modal/Section for all jobs */}
                    {showJobs && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-8 max-w-4xl w-full relative max-h-[90vh] overflow-hidden flex flex-col">
                                <button
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
                                    onClick={() => setShowJobs(false)}
                                    title="Close"
                                >
                                    &times;
                                </button>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Jobs</h2>
                                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    <AdminJobsList />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Application Stats */}
                    <div
                        className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all shadow-sm"
                        onClick={() => setShowApplications(true)}
                        title="Click to view all applications"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <FileText className="w-8 h-8 text-blue-500" />
                            <span className="text-3xl font-bold text-gray-900">{stats.applications.total}</span>
                        </div>
                        <div className="text-gray-600 font-medium">Total Applications</div>
                        <div className="text-xs text-gray-500 mt-1">
                            Recorded in system
                        </div>
                    </div>

                    {/* Modal/Section for all applications */}
                    {showApplications && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-8 max-w-4xl w-full relative max-h-[90vh] overflow-hidden flex flex-col">
                                <button
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
                                    onClick={() => setShowApplications(false)}
                                    title="Close"
                                >
                                    &times;
                                </button>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Applications</h2>
                                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                    <AdminApplicationsList />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Count */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Shield className="w-8 h-8 text-blue-500" />
                            <span className="text-3xl font-bold text-gray-900">{stats.users.admins}</span>
                        </div>
                        <div className="text-gray-600 font-medium">Admins</div>
                        <div className="text-xs text-gray-500 mt-1">
                            Authorized personnel
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Users */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center space-x-2 mb-6">
                            <UserPlus className="w-6 h-6 text-blue-500" />
                            <h2 className="text-2xl font-bold text-gray-900">Recent Registrations</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-3 text-gray-500 font-semibold text-sm">Name</th>
                                        <th className="pb-3 text-gray-500 font-semibold text-sm">Email</th>
                                        <th className="pb-3 text-gray-500 font-semibold text-sm">Role</th>
                                        <th className="pb-3 text-gray-500 font-semibold text-sm">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recentUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-gray-900 font-medium">{user.name}</td>
                                            <td className="py-4 text-gray-600">{user.email}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    user.role === 'employer' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                        'bg-green-100 text-green-700 border border-green-200'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-500 text-sm">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">System Overview</h2>
                        <div className="space-y-4 flex-1">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Database Status</div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-gray-900 font-semibold">Connected</span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">API Version</div>
                                <div className="text-gray-900 font-semibold">v1.0.0 (Stable)</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Environment</div>
                                <div className="text-gray-900 font-semibold uppercase">{process.env.NODE_ENV || 'Development'}</div>
                            </div>
                        </div>

                        <button
                            className="w-full mt-8 py-3 bg-blue-600 text-white rounded-lg font-bold transition-all hover:bg-blue-700 shadow-md"
                            onClick={() => setShowUsers(true)}
                        >
                            Manage Users
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
