import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';
import { ArrowLeft } from 'lucide-react';

// Show applications for all jobs or a selected job
export default function EmployerApplications() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('all');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        // fetch employer's jobs for filter
        const jobsRes = await api.get('/employer/my-jobs');
        const myJobs = jobsRes.data.jobs || [];
        setJobs(myJobs);

        // fetch all applications by default
        const res = await api.get('/applications/job/all');
        if (res.data.success) setApplications(res.data.applications || []);
      } catch (err) {
        console.error('Failed to fetch applications or jobs:', err, err.response?.data || 'no response');
        const message = err.response?.data?.message || err.message || 'Failed to load applications';
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  useEffect(() => {
    // fetch applications when selectedJob changes
    const fetchForJob = async () => {
      setLoading(true);
      try {
        if (selectedJob === 'all') {
          const res = await api.get('/applications/job/all');
          if (res.data.success) setApplications(res.data.applications || []);
        } else {
          const res = await api.get(`/applications/job/${selectedJob}`);
          if (res.data.success) setApplications(res.data.applications || []);
        }
      } catch (err) {
        console.error('Failed to fetch applications for job:', err, err.response?.data || 'no response');
        const message = err.response?.data?.message || err.message || 'Failed to load applications';
      } finally {
        setLoading(false);
      }
    };

    // avoid running on initial render when jobs not loaded
    if (selectedJob !== null) fetchForJob();
  }, [selectedJob]);

  return (
    <>
      <Background />
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <button onClick={() => navigate('/employer/dashboard')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t('jobDetails.back')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t('applications.title')}</h1>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <label className="text-sm text-gray-600 mr-2">{t('applications.filterByJob')}</label>
            <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="bg-gray-50 border border-gray-200 text-black px-3 py-2 rounded focus:outline-none focus:border-blue-500 transition-all">
              <option value="all">{t('applications.allJobs')}</option>
              {jobs.map(j => (
                <option key={j._id} value={j._id}>{j.title}</option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="text-blue-600 font-medium">{t('messages.loading')}</div>
          ) : applications.length === 0 ? (
            <div className="text-gray-500 italic">{t('applications.noApplicationsYet')}</div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app._id} className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:justify-between shadow-sm">
                  <div>
                    <div className="text-blue-600 font-bold text-lg mb-1">{app.jobId?.title || t('jobCard.general')}</div>
                    <div className="text-gray-700 text-sm font-medium">{t('applications.applicant')}: {app.jobSeekerId?.name || t('jobCard.general')}</div>
                    <div className="text-gray-500 text-sm mb-2">{app.jobSeekerId?.email || ''}</div>
                    {app.coverLetter && <div className="mt-2 text-gray-600 bg-white p-3 rounded border border-gray-100 italic">{app.coverLetter}</div>}
                  </div>

                  <div className="mt-3 md:mt-0 text-right">
                    <div className="text-xs text-gray-500 mb-2">{t('applications.applied')}: {new Date(app.appliedDate).toLocaleDateString()}</div>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">{app.status}</div>
                    <div className="flex items-center justify-end gap-2 mt-2">
                      {app.resume && (
                        (() => {
                          // Build an absolute URL to the resume file served by the API
                          const apiBase = api.defaults.baseURL || '';
                          const serverBase = apiBase.replace(/\/api\/?$/, '');
                          const normalizedPath = app.resume.replace(/^\/+/, '');
                          const resumeUrl = app.resume.startsWith('http') ? app.resume : `${serverBase}/${normalizedPath}`;

                          return (
                             <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors shadow-sm text-sm">{t('applications.viewResume')}</a>
                          );
                        })()
                      )}

                      {/* View Profile button */}
                      <button
                        onClick={async () => {
                          try {
                            setLoading(true);
                            const userId = app.jobSeekerId?._id || app.jobSeekerId;
                            if (!userId) {
                              return;
                            }
                            const res = await api.get(`/jobseeker/${userId}/profile`);
                            if (res.data.success) {
                              setSelectedProfile(res.data.profile);
                              setProfileModalOpen(true);
                            } else {
                              console.error('Profile not found');
                            }
                          } catch (err) {
                            console.error('Failed to load profile:', err);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="inline-block mt-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold transition-colors shadow-sm text-sm"
                      >
                        {t('jobCard.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Profile Modal */}
      {profileModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-8 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProfile.name || t('profile.seekerTitle')}</h2>
              <button onClick={() => { setProfileModalOpen(false); setSelectedProfile(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold text-gray-500">&times;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="col-span-1 flex flex-col items-center">
                <img src={selectedProfile.profilePhoto || 'https://via.placeholder.com/150?text=No+Photo'} alt={selectedProfile.name} className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md" />
                {selectedProfile.resume && (
                  (() => {
                    const apiBase = api.defaults.baseURL || '';
                    const serverBase = apiBase.replace(/\/api\/?$/, '');
                    const normalizedPath = selectedProfile.resume.replace(/^\/+/, '');
                    const resumeUrl = selectedProfile.resume.startsWith('http') ? selectedProfile.resume : `${serverBase}/${normalizedPath}`;
                    return (
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md">{t('applications.downloadResume')}</a>
                    );
                  })()
                )}
              </div>

              <div className="col-span-2 space-y-4">
                <div className="text-gray-700"><strong>{t('profile.contact')}:</strong> <span className="text-blue-600">{selectedProfile.userId?.phone || selectedProfile.phone || t('jobDetails.notSpecified')}</span></div>
                <div className="text-gray-700"><strong>{t('login.email')}:</strong> <span className="text-blue-600">{selectedProfile.email || selectedProfile.userId?.email || t('jobDetails.notSpecified')}</span></div>
                <div className="text-gray-700"><strong>{t('profile.location')}:</strong> <span className="text-gray-900">{selectedProfile.address || t('jobDetails.notSpecified')}</span></div>
                <div className="text-gray-700"><strong>{t('register.role')}:</strong> <span className="text-gray-900">{selectedProfile.age || t('jobDetails.notSpecified')}</span></div>
                <div className="mt-3 text-gray-700"><strong>{t('profile.bio')}:</strong>
                  <p className="mt-1 whitespace-pre-line text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">{selectedProfile.about || t('jobDetails.notSpecified')}</p>
                </div>

                {selectedProfile.skills?.length > 0 && (
                  <div className="mt-3 text-gray-700"><strong>{t('profile.skills')}:</strong> 
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProfile.skills.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-100 text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProfile.experience?.length > 0 && (
                  <div className="mt-3 text-gray-700">
                    <strong>{t('profile.experience')}:</strong>
                    <ul className="list-disc ml-5 mt-1 text-gray-600 space-y-1">
                      {selectedProfile.experience.map((e, i) => (
                        <li key={i} className="text-sm"><span className="font-semibold text-gray-900">{e.position}</span> at {e.company} ({e.duration})</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProfile.education?.length > 0 && (
                  <div className="mt-3 text-gray-700 pb-4">
                    <strong>{t('profile.education')}:</strong>
                    <ul className="list-disc ml-5 mt-1 text-gray-600 space-y-1">
                      {selectedProfile.education.map((ed, i) => (
                        <li key={i} className="text-sm"><span className="font-semibold text-gray-900">{ed.degree}</span> — {ed.institution} ({ed.year})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
