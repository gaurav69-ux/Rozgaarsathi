import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Shield, UserPlus } from 'lucide-react';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    <div className="text-purple-300 text-xl animate-pulse">Loading Admin Dashboard...</div>
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
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300">
                        <Shield className="w-5 h-5" />
                        <span className="font-semibold">System Administrator</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* User Stats */}
                    <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-8 h-8 text-blue-400" />
                            <span className="text-3xl font-bold text-white">{stats.users.total}</span>
                        </div>
                        <div className="text-purple-300 font-medium">Total Users</div>
                        <div className="text-xs text-gray-400 mt-1">
                            {stats.users.jobseekers} Jobseekers • {stats.users.employers} Employers
                        </div>
                    </div>

                    {/* Job Stats */}
                    <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Briefcase className="w-8 h-8 text-green-400" />
                            <span className="text-3xl font-bold text-white">{stats.jobs.total}</span>
                        </div>
                        <div className="text-purple-300 font-medium">Total Jobs</div>
                        <div className="text-xs text-gray-400 mt-1">
                            {stats.jobs.active} Active Postings
                        </div>
                    </div>

                    {/* Application Stats */}
                    <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <FileText className="w-8 h-8 text-orange-400" />
                            <span className="text-3xl font-bold text-white">{stats.applications.total}</span>
                        </div>
                        <div className="text-purple-300 font-medium">Total Applications</div>
                        <div className="text-xs text-gray-400 mt-1">
                            Recorded in system
                        </div>
                    </div>

                    {/* Admin Count */}
                    <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Shield className="w-8 h-8 text-purple-400" />
                            <span className="text-3xl font-bold text-white">{stats.users.admins}</span>
                        </div>
                        <div className="text-purple-300 font-medium">Admins</div>
                        <div className="text-xs text-gray-400 mt-1">
                            Authorized personnel
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Users */}
                    <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <UserPlus className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-bold text-white">Recent Registrations</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-purple-500/20">
                                        <th className="pb-3 text-purple-300 font-medium">Name</th>
                                        <th className="pb-3 text-purple-300 font-medium">Email</th>
                                        <th className="pb-3 text-purple-300 font-medium">Role</th>
                                        <th className="pb-3 text-purple-300 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-500/10">
                                    {recentUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-purple-500/5 transition-colors">
                                            <td className="py-4 text-white font-medium">{user.name}</td>
                                            <td className="py-4 text-gray-300">{user.email}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                                        user.role === 'employer' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                                            'bg-green-500/20 text-green-300 border border-green-500/30'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">System Overview</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/10">
                                <div className="text-sm text-purple-300 mb-1">Database Status</div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-white font-medium">Connected</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/10">
                                <div className="text-sm text-purple-300 mb-1">API Version</div>
                                <div className="text-white font-medium">v1.0.0 (Stable)</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-purple-500/10">
                                <div className="text-sm text-purple-300 mb-1">Environment</div>
                                <div className="text-white font-medium uppercase">{process.env.NODE_ENV || 'Development'}</div>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-purple-500/20 opacity-50 cursor-not-allowed">
                            Manage Users (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
