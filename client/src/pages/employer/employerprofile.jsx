import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import api from '../../utils/api';
import Navbar from '../../components/common/Navbar';
import Background from '../../components/common/Background';
import { toast } from 'react-toastify';

export default function EmployerProfile() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({
    companyName: '',
    website: '',
    description: '',
    location: '',
    industry: '',
    companyLogo: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  // Redirect to login if not authenticated (after auth loading is complete)
  useEffect(() => {
    if (!authLoading && !token) {
      toast.error('Please login first');
      navigate('/login');
    }
  }, [authLoading, token, navigate]);

  // Fetch employer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/employer/profile');
        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile);
        } else if (user) {
          setProfile(prev => ({ ...prev, companyName: user.name || '' }));
        }
      } catch (err) {
        console.log('Employer profile not found, using defaults', err?.message || err);
        if (user) {
          setProfile(prev => ({ ...prev, companyName: user.name || '' }));
        }
      } finally {
        setLoading(false);
      }
    };

    if (token && !authLoading) fetchProfile();
  }, [token, authLoading, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('companyName', profile.companyName || '');
      formData.append('website', profile.website || '');
      formData.append('description', profile.description || '');
      formData.append('location', profile.location || '');
      formData.append('industry', profile.industry || '');
      if (logoFile) formData.append('companyLogo', logoFile);

      const res = await api.put('/employer/profile', formData);
      if (res.data.success && res.data.profile) {
        setProfile(res.data.profile);
        setIsEditing(false);
        setLogoFile(null);
        setPreviewLogo(null);
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      console.error('Save employer profile error:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <>
        <Background />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-purple-300">Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-slate-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center space-x-6 mb-6">
            <div>
              <img
                src={previewLogo || profile.companyLogo || 'https://via.placeholder.com/120?text=Logo'}
                alt={profile.companyName}
                className="w-24 h-24 object-cover rounded-md border border-gray-600"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{profile.companyName || 'Company Name'}</h2>
              <p className="text-sm text-purple-300">{profile.industry || ''}</p>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg">Edit Profile</button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Company Name</label>
              {isEditing ? (
                <input name="companyName" value={profile.companyName || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white" />
              ) : (
                <p className="text-white">{profile.companyName || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Website</label>
              {isEditing ? (
                <input name="website" value={profile.website || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white" />
              ) : (
                <p className="text-white">{profile.website || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Location</label>
              {isEditing ? (
                <input name="location" value={profile.location || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white" />
              ) : (
                <p className="text-white">{profile.location || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Industry</label>
              {isEditing ? (
                <input name="industry" value={profile.industry || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white" />
              ) : (
                <p className="text-white">{profile.industry || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
              {isEditing ? (
                <textarea name="description" value={profile.description || ''} onChange={handleInputChange} rows={5} className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white" />
              ) : (
                <p className="text-white whitespace-pre-line">{profile.description || 'No description provided'}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center space-x-4 mt-6">
                <label className="px-4 py-2 bg-slate-700 rounded-lg cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  Upload Logo
                </label>

                <button onClick={handleSaveProfile} className="px-6 py-2 bg-green-500 text-white rounded-lg">Save Changes</button>
                <button onClick={() => { setIsEditing(false); setLogoFile(null); setPreviewLogo(null); }} className="px-6 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
