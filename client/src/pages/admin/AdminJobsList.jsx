
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Trash2 } from 'lucide-react';


const AdminJobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmJob, setConfirmJob] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs?limit=1000');
      setJobs(res.data.jobs || []);
    } catch (err) {
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);


  const handleDelete = async (jobId) => {
    setDeleting(jobId);
    try {
      const res = await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
      if (res.data.deletedBy === 'admin') {
        setNotification(`Job "${res.data.jobTitle}" deleted by admin. Employer (${res.data.employer?.email}) will be notified.`);
      } else {
        setNotification('Job deleted successfully.');
      }
    } catch (err) {
      setNotification('Failed to delete job');
    } finally {
      setDeleting(null);
      setConfirmJob(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  if (loading) return <div className="text-purple-300">Loading jobs...</div>;
  if (error) return <div className="text-red-400">{error}</div>;


  return (
    <div className="overflow-x-auto relative">
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-purple-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-purple-500/20">
            <th className="pb-3 text-purple-300 font-medium">Title</th>
            <th className="pb-3 text-purple-300 font-medium">Company</th>
            <th className="pb-3 text-purple-300 font-medium">Location</th>
            <th className="pb-3 text-purple-300 font-medium">Posted</th>
            <th className="pb-3 text-purple-300 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-500/10">
          {jobs.map(job => (
            <tr key={job._id}>
              <td className="py-3 text-white font-medium">{job.title}</td>
              <td className="py-3 text-gray-300">{job.companyName || job.employerId?.name}</td>
              <td className="py-3 text-gray-300">{job.location}</td>
              <td className="py-3 text-gray-400">{new Date(job.postedDate).toLocaleDateString()}</td>
              <td className="py-3">
                <button
                  className="text-red-400 hover:text-red-600 disabled:opacity-50"
                  onClick={() => setConfirmJob(job)}
                  disabled={deleting === job._id}
                  title="Delete Job"
                >
                  <Trash2 className="inline w-5 h-5" />
                  {deleting === job._id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.length === 0 && <div className="text-gray-400 py-6">No jobs found.</div>}

      {/* Custom confirmation dialog */}
      {confirmJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-xl p-8 shadow-2xl max-w-md w-full relative">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-purple-200 mb-6">Are you sure you want to delete the job <span className="font-semibold text-white">"{confirmJob.title}"</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                onClick={() => setConfirmJob(null)}
                disabled={deleting === confirmJob._id}
              >Cancel</button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleDelete(confirmJob._id)}
                disabled={deleting === confirmJob._id}
              >{deleting === confirmJob._id ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobsList;
