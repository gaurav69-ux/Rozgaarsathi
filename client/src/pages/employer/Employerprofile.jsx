import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import api from '../../utils/api';
import Navbar from '../../components/common/Navbar';
import Background from '../../components/common/Background';

export default function EmployerProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
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
      navigate('/login');
    }
  }, [authLoading, token, navigate, t]);

  // Fetch employer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/employer/profile');
        if (res.data.success && res.data.profile) {
          const { userId, ...profileData } = res.data.profile;
          setProfile({
            ...profileData,
            name: userId?.name || user?.name || '',
            phone: userId?.phone || user?.phone || ''
          });
        }
      } catch (err) {
        console.log('Employer profile not found, using defaults', err?.message || err);
        if (user) {
          setProfile(prev => ({
            ...prev,
            name: user.name || '',
            phone: user.phone || '',
            companyName: user.name || ''
          }));
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
      formData.append('name', profile.name || '');
      formData.append('phone', profile.phone || '');
      formData.append('companyName', profile.companyName || '');
      formData.append('website', profile.website || '');
      formData.append('description', profile.description || '');
      formData.append('location', profile.location || '');
      formData.append('industry', profile.industry || '');
      if (logoFile) formData.append('companyLogo', logoFile);

      const res = await api.put('/employer/profile', formData);
      if (res.data.success && res.data.profile) {
        const { userId, ...updatedProfile } = res.data.profile;
        setProfile({
          ...updatedProfile,
          name: profile.name, // Keep current values as they were just saved
          phone: profile.phone
        });
        setIsEditing(false);
        setLogoFile(null);
        setPreviewLogo(null);
      }
    } catch (err) {
      console.error('Save employer profile error:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Background />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-blue-600">{t('messages.loading')}</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-8">
          <div className="flex items-center space-x-6 mb-6">
            <div>
              <img
                src={previewLogo || profile.companyLogo || 'https://via.placeholder.com/120?text=Logo'}
                alt={profile.companyName}
                className="w-24 h-24 object-cover rounded-md border border-gray-600"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{profile.companyName || t('profile.companyName')}</h2>
              <p className="text-sm text-blue-600 font-medium">{profile.industry || ''}</p>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">{t('profile.editProfile')}</button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Employer Name</label>
              {isEditing ? (
                <input name="name" value={profile.name || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all" />
              ) : (
                <p className="text-gray-900">{profile.name || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              {isEditing ? (
                <input name="phone" value={profile.phone || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all" />
              ) : (
                <p className="text-gray-900">{profile.phone || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('profile.companyName')}</label>
              {isEditing ? (
                <input name="companyName" value={profile.companyName || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all" />
              ) : (
                <p className="text-gray-900">{profile.companyName || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('profile.website')}</label>
              {isEditing ? (
                <input name="website" value={profile.website || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all" />
              ) : (
                <p className="text-gray-900">{profile.website || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('profile.location')}</label>
              {isEditing ? (
                <input name="location" value={profile.location || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all" />
              ) : (
                <p className="text-gray-900">{profile.location || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('profile.industry')}</label>
              {isEditing ? (
                <input name="industry" value={profile.industry || ''} onChange={handleInputChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all" />
              ) : (
                <p className="text-gray-900">{profile.industry || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('profile.bio')}</label>
              {isEditing ? (
                <textarea name="description" value={profile.description || ''} onChange={handleInputChange} rows={5} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all" />
              ) : (
                <p className="text-gray-900 whitespace-pre-line leading-relaxed">{profile.description || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center space-x-4 mt-6">
                <label className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                  <input type="file" accept="image/*, image/webp, .webp" onChange={handleLogoChange} className="hidden" />
                  {t('profile.uploadLogo')}
                </label>

                <button onClick={handleSaveProfile} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm">{t('profile.updateProfile')}</button>
                <button onClick={() => { setIsEditing(false); setLogoFile(null); setPreviewLogo(null); }} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-sm">{t('jobDetails.back')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
