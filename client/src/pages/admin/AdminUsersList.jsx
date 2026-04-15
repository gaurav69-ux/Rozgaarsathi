
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Trash2, User, Mail } from 'lucide-react';


const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const handleDelete = async (userId) => {
    setDeleting(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setNotification('User deleted successfully.');
    } catch (err) {
      setNotification(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
      setConfirmUser(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  if (loading) return <div className="text-blue-600 font-medium">Loading users...</div>;
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
            <th className="pb-3 text-gray-500 font-semibold text-sm">Name</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Email</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Role</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm">Joined</th>
            <th className="pb-3 text-gray-500 font-semibold text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map(user => (
            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-semibold">{user.name}</span>
                </div>
              </td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
              </td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  user.role === 'employer' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    'bg-green-100 text-green-700 border border-green-200'
                  }`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="py-3 text-right">
                <button
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 font-bold text-xs uppercase flex items-center justify-end gap-1 ml-auto"
                  onClick={() => setConfirmUser(user)}
                  disabled={deleting === user._id}
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting === user._id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <div className="text-gray-500 py-6 italic text-center">No users found.</div>}

      {/* Custom confirmation dialog */}
      {confirmUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-2xl max-w-md w-full relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Are you sure you want to delete the user <span className="font-bold text-blue-600">"{confirmUser.name}"</span> ({confirmUser.email})? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-colors"
                onClick={() => setConfirmUser(null)}
                disabled={deleting === confirmUser._id}
              >Cancel</button>
              <button
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 font-semibold transition-colors shadow-sm"
                onClick={() => handleDelete(confirmUser._id)}
                disabled={deleting === confirmUser._id}
              >{deleting === confirmUser._id ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;
