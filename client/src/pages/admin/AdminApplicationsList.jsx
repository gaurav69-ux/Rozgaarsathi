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

  if (loading) return <div className="text-blue-600 font-medium">Loading applications...</div>;
  if (error) return <div className="text-red-600 font-medium">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="pb-3 text-gray-500 font-semibold text-sm">Job Title</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Applicant</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Email</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Applied On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {applications.map(app => (
            <tr key={app._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 text-gray-900 font-semibold">{app.jobTitle}</td>
              <td className="py-3 text-gray-700">{app.applicantName}</td>
              <td className="py-3 text-gray-600">{app.applicantEmail}</td>
              <td className="py-3 text-gray-500 text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length === 0 && <div className="text-gray-500 py-6 italic text-center">No applications found.</div>}
    </div>
  );
};

export default AdminApplicationsList;
