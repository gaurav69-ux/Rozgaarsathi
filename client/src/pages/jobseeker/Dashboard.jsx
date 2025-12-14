import { useState, useEffect } from 'react';
import { Briefcase, Search, Heart, Send, TrendingUp, Zap } from 'lucide-react';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import JobCard from '../../components/common/JobCard';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications/my-applications')
      ]);
      
      setJobs(jobsRes.data.jobs || []);
      setApplications(appsRes.data.applications || []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }
    
    try {
      const res = await api.get(`/jobs?title=${searchQuery}`);
      setJobs(res.data.jobs || []);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const stats = [
    { label: 'Available Jobs', value: jobs.length, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { label: 'Applications', value: applications.length, icon: Send, color: 'from-blue-500 to-cyan-500' },
    { label: 'Saved Jobs', value: savedJobs.length, icon: Heart, color: 'from-pink-500 to-rose-500' },
    { label: 'Profile Views', value: '0', icon: TrendingUp, color: 'from-green-500 to-emerald-500' }
  ];

  if (loading) {
    return (
      <>
        <Background />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-purple-300 text-xl">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Background />
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-purple-300">
            Explore thousands of opportunities from top companies
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:transform hover:scale-105"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-purple-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default JobSeekerDashboard;