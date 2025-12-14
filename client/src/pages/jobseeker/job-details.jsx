import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';
import { useAuth } from '../../context/authContext';
import { toast } from 'react-toastify';
import { MapPin, DollarSign, Clock, Building } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) setJob(res.data.job);
      } catch (err) {
        console.error('Failed to load job:', err);
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Check if user already applied
  useEffect(() => {
    const checkApplied = async () => {
      if (!isAuthenticated || authLoading) return;

      try {
        const res = await api.get('/applications/my-applications');
        if (res.data.success) {
          const applied = res.data.applications.some(app => (app.jobId && (app.jobId._id === id || app.jobId === id)));
          setHasApplied(!!applied);
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      }
    };

    checkApplied();
  }, [isAuthenticated, authLoading, id]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      navigate('/login');
      return;
    }

    if (user?.role !== 'jobseeker') {
      toast.error('Only job seekers can save jobs');
      return;
    }

    setSaving(true);
    try {
      await api.post(`/jobs/${id}/save`);
      toast.success('Job saved/unsaved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user?.role !== 'jobseeker') {
      toast.error('Only job seekers can apply');
      return;
    }

      if (hasApplied) {
        toast.info('You have already applied to this job');
        return;
      }

    if (!resumeFile) {
      toast.error('Please attach your resume');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('resume', resumeFile);

      await api.post('/applications', formData);
      toast.success('Application submitted');
      setHasApplied(true);
    } catch (err) {
      console.error('Apply error:', err);
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Background />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-purple-300">Loading job...</div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Background />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-300">Job not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Background />
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="bg-slate-900/70 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
              <div className="text-purple-300 mb-1">{job.employerId?.name || 'Company'}</div>
              <div className="text-gray-300 text-sm flex items-center space-x-4">
                {job.location && (
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-purple-400" />{job.location}</span>
                )}
                <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-purple-400" />{job.jobType}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Job Description</h3>
            <p className="text-gray-300 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Requirements</h3>
              <p className="text-gray-300 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm text-purple-300 mb-2">Salary</h4>
              <div className="text-white">
                {job.salary?.min && job.salary?.max ? `${job.salary.currency} ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}` : 'Not specified'}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm text-purple-300 mb-2">Category</h4>
              <div className="text-white">{job.category || 'General'}</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm text-purple-300 mb-2">Apply</h4>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              {/* Back button to nearby jobs */}
              <button
                onClick={() => navigate('/jobseeker/nearby-jobs')}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 mr-0 md:mr-3 mb-3 md:mb-0"
              >
                Back
              </button>

              {hasApplied ? (
                <div className="inline-flex items-center space-x-3">
                  <button disabled className="px-6 py-3 bg-gray-600 text-gray-200 rounded-lg cursor-not-allowed">Already Applied</button>
                </div>
              ) : (
                <>
                  <input type="file" accept="application/pdf,application/msword" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="mb-3 md:mb-0" />
                  <button onClick={handleApply} disabled={applying} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
