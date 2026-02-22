import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';
import { useAuth } from '../../context/authContext';
import { MapPin, IndianRupee, Clock, Building } from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      navigate('/login');
      return;
    }

    if (user?.role !== 'jobseeker') {
      return;
    }

    setSaving(true);
    try {
      await api.post(`/jobs/${id}/save`);
    } catch (err) {
      console.error('Failed to save job:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'jobseeker') {
      return;
    }

    if (hasApplied) {
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await api.post('/applications', formData);
      setHasApplied(true);
    } catch (err) {
      console.error('Apply error:', err);
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
          <div className="text-purple-300">{t('jobDetails.loadingJob')}</div>
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
          <div className="text-red-300">{t('jobDetails.jobNotFound')}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Background />
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="bg-slate-900/70 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 relative">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="pr-16 md:pr-0">
              <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
              <div className="text-purple-300 mb-1">{job.employerId?.name || t('jobCard.company')}</div>
              <div className="text-gray-300 text-sm flex items-center space-x-4">
                {job.location && (
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-purple-400" />{job.location}</span>
                )}
                <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-purple-400" />{job.jobType}</span>
              </div>
            </div>

            <div className="absolute top-8 right-8 md:static md:mt-0 flex items-center space-x-3">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30">
                {saving ? t('jobDetails.saving') : t('jobDetails.save')}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{t('jobDetails.description')}</h3>
            <p className="text-gray-300 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{t('jobDetails.requirements')}</h3>
              <p className="text-gray-300 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm text-purple-300 mb-2">{t('jobDetails.salary')}</h4>
              {job.salary?.min && job.salary?.max ? (
                <span className="flex items-center">
                  <IndianRupee className="w-4 h-4 mr-2 text-purple-400" />
                  {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                </span>
              ) : t('jobDetails.notSpecified')}
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h4 className="text-sm text-purple-300 mb-2">{t('jobDetails.category')}</h4>
              <div className="text-white">{job.category || t('jobCard.general')}</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm text-purple-300 mb-5">{t('jobDetails.apply')}</h4>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Apply / Already Applied - Order 1 on mobile, 3 on md+ */}
              <div className="order-1 md:order-3">
                {hasApplied ? (
                  <button
                    disabled
                    className="px-6 py-3 bg-gray-600 text-gray-200 rounded-lg cursor-not-allowed w-full md:w-auto"
                  >
                    {t('jobDetails.alreadyApplied')}
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg w-full md:w-auto"
                  >
                    {applying ? t('jobDetails.applying') : t('jobDetails.applyNow')}
                  </button>
                )}
              </div>

              {/* Back button - Order 2 on mobile, 1 on md+ */}
              <button
                onClick={() => navigate('/jobseeker/nearby-jobs')}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 order-2 md:order-1 w-full md:w-auto"
              >
                {t('jobDetails.back')}
              </button>

              {/* Resume Upload - Order 3 on mobile, 2 on md+ */}
              {!hasApplied && (
                <label className="flex flex-col sm:flex-row sm:items-center bg-slate-800 rounded-lg p-3 text-gray-300 order-3 md:order-2 w-full md:w-auto gap-2 overflow-hidden border border-purple-500/10">
                  <input
                    type="file"
                    accept="application/pdf,application/msword"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="text-xs w-full cursor-pointer file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 transition-all"
                  />
                  <span className="text-[10px] text-gray-400 italic shrink-0">({t('jobDetails.optional')})</span>
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
