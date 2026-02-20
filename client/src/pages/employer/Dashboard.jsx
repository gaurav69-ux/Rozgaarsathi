import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Briefcase, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const { t } = useTranslation();
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requirements: '',
    category: '',
    jobType: 'full-time',
    location: '',
    experienceLevel: '',
    salary: { min: '', max: '', currency: 'USD' }
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/employer/my-jobs');
      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', jobForm);
      setShowCreateJob(false);
      setJobForm({
        title: '',
        description: '',
        requirements: '',
        category: '',
        jobType: 'full-time',
        location: '',
        experienceLevel: '',
        salary: { min: '', max: '', currency: 'USD' }
      });
      fetchJobs();
    } catch (error) {
      console.error(error.response?.data?.message || 'Failed to create job');
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm(t('dashboard.deleteConfirmation'))) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const totalApplications = jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const navigate = useNavigate();

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('dashboard.employerTitle')}
          </h1>
          <button
            onClick={() => setShowCreateJob(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>{t('dashboard.postNewJob')}</span>
          </button>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-white">{jobs.length}</span>
            </div>
            <div className="text-purple-300">{t('dashboard.postedJobs')}</div>
          </div>

          <div onClick={() => navigate('/employer/applications')} className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 hover:cursor-pointer hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-white">{totalApplications}</span>
            </div>
            <div className="text-purple-300">{t('dashboard.totalApplications')}</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-white">{activeJobs}</span>
            </div>
            <div className="text-purple-300">{t('dashboard.activeJobs')}</div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">{t('dashboard.yourJobPostings')}</h2>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-purple-300 text-lg mb-4">{t('dashboard.noJobsPosted')}</p>
              <button
                onClick={() => setShowCreateJob(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all"
              >
                {t('dashboard.postFirstJob')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job._id} className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800/70 transition-all">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <p className="text-purple-300 text-sm">{job.location} • {job.jobType}</p>
                    <p className="text-gray-400 text-sm mt-1">{t('dashboard.posted')}: {new Date(job.postedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{job.applicationCount || 0}</div>
                      <div className="text-sm text-purple-300">{t('dashboard.totalApplications')}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${job.status === 'active'
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                      {job.status}
                    </span>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title={t('dashboard.deleteJob')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Job Modal */}
        {showCreateJob && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t('dashboard.postNewJob')}
              </h2>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <input
                  type="text"
                  placeholder={t('nearbyJobs.jobTitle') + "*"}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />

                <textarea
                  placeholder={t('jobDetails.description') + "*"}
                  rows="4"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder={t('jobDetails.requirements')}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t('jobDetails.category')}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    value={jobForm.category}
                    onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                  />

                  <select
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="remote">Remote</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder={t('nearbyJobs.location') + "*"}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="Experience Level (e.g., Senior, Mid-level)"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  value={jobForm.experienceLevel}
                  onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min Salary"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    value={jobForm.salary.min}
                    onChange={(e) => setJobForm({ ...jobForm, salary: { ...jobForm.salary, min: e.target.value } })}
                  />

                  <input
                    type="number"
                    placeholder="Max Salary"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    value={jobForm.salary.max}
                    onChange={(e) => setJobForm({ ...jobForm, salary: { ...jobForm.salary, max: e.target.value } })}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateJob(false)}
                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                  >
                    {t('jobDetails.back')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all"
                  >
                    {t('dashboard.postNewJob')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployerDashboard;