import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Heart, Send, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import JobCard from '../../components/common/JobCard';
import api from '../../utils/api';

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [jobsCount, setJobsCount] = useState(0);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applied');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes, profileRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications/my-applications'),
        api.get('/jobseeker/profile')
      ]);

      setJobsCount(jobsRes.data.count || jobsRes.data.jobs?.length || 0);
      setApplications(appsRes.data.applications || []);
      setSavedJobs(profileRes.data.profile.savedJobs || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSaveToggle = (jobId) => {
    // Just remove from saved list if toggled here
    setSavedJobs(prev => prev.filter(job => job._id !== jobId));
  };

  const stats = [
    { id: 'browse', label: t('dashboard.availableJobs'), value: jobsCount, icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { id: 'applied', label: t('dashboard.jobApplied'), value: applications.length, icon: Send, color: 'from-blue-500 to-cyan-500' },
    { id: 'saved', label: t('dashboard.savedJobs'), value: savedJobs.length, icon: Heart, color: 'from-pink-500 to-rose-500' }
  ];


  if (loading) {
    return (
      <>
        <Background />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-purple-300 text-xl">{t('messages.loading')}</div>
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
          <h1 className="text-5xl font-bold mb-4 text-blue-600">
            {t('dashboard.jobSeekerTitle')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('dashboard.jobSeekerSubtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              onClick={() => stat.id === 'browse' ? navigate('/jobseeker/nearby-jobs') : setActiveTab(stat.id)}
              className={`bg-white border-2 rounded-2xl p-6 transition-all hover:transform hover:scale-105 shadow-sm cursor-pointer ${activeTab === stat.id ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-300'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {activeTab === stat.id && (
                  <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
                )}
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dynamic Content Based on Active Tab */}
        <div className="space-y-8">

          {activeTab === 'applied' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Send className="w-6 h-6 text-blue-500" />
                  My Applications
                </h2>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                  {applications.length} TOTAL
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                  <div key={app._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/jobs/${app.jobId?._id}`)}>
                          {app.jobId?.title || 'Unknown Job'}
                        </h3>
                        <p className="text-gray-500 text-sm">{app.jobId?.companyName || 'Not Specified'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                        }`}>
                        {app.status}
                      </span>
                      <p className="text-gray-400 text-xs">
                        Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                    <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-6">Start applying to jobs to track them here</p>
                    <button
                      onClick={() => navigate('/jobseeker/nearby-jobs')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                      Find Nearby Jobs
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-500" />
                  Saved Jobs
                </h2>
                <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold">
                  {savedJobs.length} SAVED
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onSaveToggle={() => handleSaveToggle(job._id)}
                  />
                ))}
              </div>
              {savedJobs.length === 0 && (
                <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No saved jobs</h3>
                  <p className="text-gray-500 mb-6">Heart the jobs you're interested in to save them</p>
                  <button
                    onClick={() => navigate('/jobseeker/nearby-jobs')}
                    className="px-6 py-2 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-all"
                  >
                    Explore Jobs
                  </button>
                </div>
              )}
            </div>
          )}
        </div>


      </div>
    </>
  );
};

export default JobSeekerDashboard;