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
    address: '',
    jobType: 'full-time',
    location: '',
    experienceLevel: '',
    salary: { min: '', max: '', currency: 'INR' }
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
        address: '',
        jobType: 'full-time',
        location: '',
        experienceLevel: '',
        salary: { min: '', max: '', currency: 'INR' }
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
          <div className="text-blue-600 text-xl font-medium">{t('messages.loading')}</div>
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
            {t('dashboard.employerTitle')}
          </h1>
          <button
            onClick={() => setShowCreateJob(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>{t('dashboard.postNewJob')}</span>
          </button>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900">{jobs.length}</span>
            </div>
            <div className="text-gray-600 font-medium">{t('dashboard.postedJobs')}</div>
          </div>

          <div onClick={() => navigate('/employer/applications')} className="bg-white border border-gray-200 rounded-xl p-6 hover:cursor-pointer hover:border-blue-400 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900">{totalApplications}</span>
            </div>
            <div className="text-gray-600 font-medium">{t('dashboard.totalApplications')}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900">{activeJobs}</span>
            </div>
            <div className="text-gray-600 font-medium">{t('dashboard.activeJobs')}</div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('dashboard.yourJobPostings')}</h2>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">{t('dashboard.noJobsPosted')}</p>
              <button
                onClick={() => setShowCreateJob(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md"
              >
                {t('dashboard.postFirstJob')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job._id} className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-all shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <p className="text-blue-600 text-sm font-medium">{job.location} • {job.jobType}</p>
                    <p className="text-gray-500 text-xs mt-1">{t('dashboard.posted')}: {new Date(job.postedDate).toLocaleDateString()}</p>
                    {job.removedByAdmin && (
                      <div className="mt-2 p-2 bg-red-900/40 border border-red-500/30 rounded text-red-300 text-sm font-semibold">
                        {job.removedReason || 'This job was removed by an administrator.'}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{job.applicationCount || 0}</div>
                      <div className="text-sm text-gray-500">{t('dashboard.totalApplications')}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'active'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                      {job.status}
                    </span>
                    {!job.removedByAdmin && (
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title={t('dashboard.deleteJob')}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Job Modal */}
        {showCreateJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
                {t('dashboard.postNewJob')}
              </h2>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <input
                  type="text"
                  placeholder={t('JobTitle / कार्य क्या है?') + "*"}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />

                <textarea
                  placeholder={t('Job Description/ नौकरी के बारे में बताएँ') + "*"}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder={t('Requirements / इस व्यक्ति को काम के बारे में क्या पता होना चाहिए??')}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                />

                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all font-medium"
                    value={jobForm.jobType}
                    onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                  >
                    <option value="full-time">Full Time / दिनभर का काम</option>
                    <option value="part-time">Part Time / कुछ घंटे का काम</option>
                    <option value="remote">Remote/ घर से काम</option>
                    <option value="contract">Contract / ठेके का काम</option>
                  </select>

                <div>
                  <input
                    type="text"
                    placeholder={t('Location / जगह') + "*"}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    required
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Rajura', 'Ballarpur', 'Chandrapur'].map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setJobForm({ ...jobForm, location: city })}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-sm ${jobForm.location === city
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder={t('Business Address / व्यवसाय का पता') + "*"}
                  rows="2"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  value={jobForm.address}
                  onChange={(e) => setJobForm({ ...jobForm, address: e.target.value })}
                  required
                />

                {/* <input
                  type="text"
                  placeholder="Experience Level (e.g., Senior, Mid-level)"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  value={jobForm.experienceLevel}
                  onChange={(e) => setJobForm({ ...jobForm, experienceLevel: e.target.value })}
                /> */}

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Min Salary / कम से कम वेतन"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                    value={jobForm.salary.min}
                    onChange={(e) => setJobForm({ ...jobForm, salary: { ...jobForm.salary, min: e.target.value } })}
                  />

                  <input
                    type="number"
                    placeholder="Max Salary / ज्यादा से ज्यादा वेतन"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all font-medium"
                    value={jobForm.salary.max}
                    onChange={(e) => setJobForm({ ...jobForm, salary: { ...jobForm.salary, max: e.target.value } })}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateJob(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all"
                  >
                    {t('jobDetails.back')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md"
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