import { useEffect, useState } from 'react';
import api from '../../utils/api';

const AdminApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/applications');
        setApplications(res.data.applications || []);
      } catch (err) {
        setError('Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <div className="text-purple-300">Loading applications...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-purple-500/20">
            <th className="pb-3 text-purple-300 font-medium">Job Title</th>
            <th className="pb-3 text-purple-300 font-medium">Applicant</th>
            <th className="pb-3 text-purple-300 font-medium">Email</th>
            <th className="pb-3 text-purple-300 font-medium">Applied On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-500/10">
          {applications.map(app => (
            <tr key={app._id}>
              <td className="py-3 text-white font-medium">{app.jobTitle}</td>
              <td className="py-3 text-gray-300">{app.applicantName}</td>
              <td className="py-3 text-gray-300">{app.applicantEmail}</td>
              <td className="py-3 text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length === 0 && <div className="text-gray-400 py-6">No applications found.</div>}
    </div>
  );
};

export default AdminApplicationsList;
