
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

  if (loading) return <div className="text-blue-600 font-medium">Loading jobs...</div>;
  if (error) return <div className="text-red-600 font-medium">{error}</div>;


  return (
    <div className="overflow-x-auto relative">
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in font-semibold">
          {notification}
        </div>
      )}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-3 text-gray-500 font-semibold text-sm">Title</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Company</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Location</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Posted</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {jobs.map(job => (
            <tr key={job._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 text-gray-900 font-semibold">{job.title}</td>
              <td className="py-3 text-gray-700">{job.companyName || job.employerId?.name}</td>
              <td className="py-3 text-gray-600 text-sm">{job.location}</td>
              <td className="py-3 text-gray-500 text-xs">{new Date(job.postedDate).toLocaleDateString()}</td>
              <td className="py-3 text-right">
                <button
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 font-bold text-xs uppercase flex items-center justify-end gap-1 ml-auto"
                  onClick={() => setConfirmJob(job)}
                  disabled={deleting === job._id}
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting === job._id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.length === 0 && <div className="text-gray-500 py-6 italic text-center">No jobs found.</div>}

      {/* Custom confirmation dialog */}
      {confirmJob && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-2xl max-w-md w-full relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Are you sure you want to delete the job <span className="font-bold text-blue-600">"{confirmJob.title}"</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-colors"
                onClick={() => setConfirmJob(null)}
                disabled={deleting === confirmJob._id}
              >Cancel</button>
              <button
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors shadow-sm"
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
