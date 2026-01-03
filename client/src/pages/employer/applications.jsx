import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';

// Show applications for all jobs or a selected job
export default function EmployerApplications() {
  const navigate = useNavigate();
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
        toast.error(message);
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
        toast.error(message);
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
          <button onClick={() => navigate('/employer/dashboard')} className="px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-3xl font-bold text-white">Applications</h1>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6">
          <div className="mb-4">
            <label className="text-sm text-gray-300 mr-2">Filter by job:</label>
            <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded">
              <option value="all">All Jobs</option>
              {jobs.map(j => (
                <option key={j._id} value={j._id}>{j.title}</option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="text-purple-300">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="text-gray-300">No applications yet.</div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app._id} className="bg-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:justify-between">
                  <div>
                    <div className="text-white font-semibold">{app.jobId?.title || 'Job'}</div>
                    <div className="text-gray-400 text-sm">Applicant: {app.jobSeekerId?.name || 'N/A'} ({app.jobSeekerId?.email || ''})</div>
                    {app.coverLetter && <div className="mt-2 text-gray-300 whitespace-pre-line">{app.coverLetter}</div>}
                  </div>

                  <div className="mt-3 md:mt-0 text-right">
                    <div className="text-sm text-gray-400">Applied: {new Date(app.appliedDate).toLocaleString()}</div>
                    <div className="text-white font-bold mt-2">{app.status}</div>
                    <div className="flex items-center justify-end gap-2 mt-2">
                    {app.resume && (
                      (() => {
                        // Build an absolute URL to the resume file served by the API
                        const apiBase = api.defaults.baseURL || '';
                        const serverBase = apiBase.replace(/\/api\/?$/, '');
                        const normalizedPath = app.resume.replace(/^\/+/, '');
                        const resumeUrl = app.resume.startsWith('http') ? app.resume : `${serverBase}/${normalizedPath}`;

                        return (
                          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white rounded">View Resume</a>
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
                            toast.error('No jobseeker ID available');
                            return;
                          }
                          const res = await api.get(`/jobseeker/${userId}/profile`);
                          if (res.data.success) {
                            setSelectedProfile(res.data.profile);
                            setProfileModalOpen(true);
                          } else {
                            toast.error('Profile not found');
                          }
                        } catch (err) {
                          console.error('Failed to load profile:', err);
                          toast.error('Failed to load profile');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="inline-block mt-2 px-3 py-1 bg-gray-600 text-white rounded"
                    >
                      View Profile
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-3xl mx-4">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-white">{selectedProfile.name || 'Profile'}</h2>
              <button onClick={() => { setProfileModalOpen(false); setSelectedProfile(null); }} className="text-gray-300">Close</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="col-span-1 flex flex-col items-center">
                <img src={selectedProfile.profilePhoto || 'https://via.placeholder.com/150?text=No+Photo'} alt={selectedProfile.name} className="w-32 h-32 rounded-full object-cover border-2 border-purple-600" />
                {selectedProfile.resume && (
                  (() => {
                    const apiBase = api.defaults.baseURL || '';
                    const serverBase = apiBase.replace(/\/api\/?$/, '');
                    const normalizedPath = selectedProfile.resume.replace(/^\/+/, '');
                    const resumeUrl = selectedProfile.resume.startsWith('http') ? selectedProfile.resume : `${serverBase}/${normalizedPath}`;
                    return (
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded">Download Resume</a>
                    );
                  })()
                )}
              </div>

              <div className="col-span-2">
                <div className="text-gray-300"><strong>Contact:</strong> {selectedProfile.userId?.phone || selectedProfile.phone || 'N/A'}</div>
                <div className="text-gray-300"><strong>Email:</strong> {selectedProfile.email || selectedProfile.userId?.email || 'N/A'}</div>
                <div className="text-gray-300"><strong>Address:</strong> {selectedProfile.address || 'N/A'}</div>
                <div className="text-gray-300"><strong>Age:</strong> {selectedProfile.age || 'N/A'}</div>
                <div className="mt-3 text-gray-300"><strong>About:</strong>
                  <p className="mt-1 whitespace-pre-line">{selectedProfile.about || 'No description'}</p>
                </div>

                {selectedProfile.skills?.length > 0 && (
                  <div className="mt-3 text-gray-300"><strong>Skills:</strong> {selectedProfile.skills.join(', ')}</div>
                )}

                {selectedProfile.experience?.length > 0 && (
                  <div className="mt-3 text-gray-300">
                    <strong>Experience:</strong>
                    <ul className="list-disc ml-5 mt-1 text-gray-300">
                      {selectedProfile.experience.map((e, i) => (
                        <li key={i}>{e.position} at {e.company} ({e.duration})</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProfile.education?.length > 0 && (
                  <div className="mt-3 text-gray-300">
                    <strong>Education:</strong>
                    <ul className="list-disc ml-5 mt-1 text-gray-300">
                      {selectedProfile.education.map((ed, i) => (
                        <li key={i}>{ed.degree} — {ed.institution} ({ed.year})</li>
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
