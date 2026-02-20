import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import api from '../../utils/api';
import { FileText, Download, Trash2 } from 'lucide-react';
import Navbar from '../../components/common/Navbar';

export default function JobSeekerProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    age: '',
    about: '',
    profilePhoto: '',
    resume: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  // Redirect to login if not authenticated (after auth loading is complete)
  useEffect(() => {
    if (!authLoading && !token) {
      navigate('/login');
    }
  }, [authLoading, token, navigate, t]);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/jobseeker/profile');
        // Extract profile from response data
        const profileData = response.data.profile || response.data;
        setProfile(profileData);
        setLoading(false);
      } catch (error) {
        console.log('Profile not found, using defaults:', error.message);
        // Initialize with default values if no profile exists yet
        if (user) {
          setProfile((prev) => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
          }));
        }
        setLoading(false);
      }
    };

    // Only fetch if authenticated and auth is done loading
    if (token && !authLoading) {
      fetchProfile();
    } else if (!authLoading && !token) {
      // Not authenticated
      setLoading(false);
    }
  }, [token, authLoading, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Only allow PDF and DOC files
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', profile.name || '');
      formData.append('email', profile.email || '');
      formData.append('address', profile.address || '');
      formData.append('age', profile.age || '');
      formData.append('about', profile.about || '');

      if (photoFile) {
        formData.append('profilePhoto', photoFile);
      }

      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      console.log('Sending profile update...');

      const response = await api.post('/jobseeker/profile', formData);

      console.log('Profile update response:', response.data);

      // Extract profile data from response
      const responseData = response.data;
      const updatedProfile = {
        name: responseData.name || profile.name,
        email: responseData.email || profile.email,
        address: responseData.address || profile.address,
        age: responseData.age || profile.age,
        about: responseData.about || profile.about,
        profilePhoto: responseData.profilePhoto || profile.profilePhoto,
        resume: responseData.resume || profile.resume,
      };

      setProfile(updatedProfile);
      setPhotoFile(null);
      setPreviewPhoto(null);
      setResumeFile(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-white text-lg">{t('messages.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Card */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-8">
          {/* Profile Header with Photo */}
          <div className="flex flex-col items-center mb-8">
            {/* Profile Photo */}
            <div className="mb-6">
              <div className="relative">
                <img
                  src={
                    previewPhoto ||
                    profile.profilePhoto ||
                    'https://via.placeholder.com/150?text=No+Photo'
                  }
                  alt={profile.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mb-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('profile.editProfile')}
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('register.fullName')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder={t('register.fullName')}
                />
              ) : (
                <p className="text-white text-lg">{profile.name || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('register.email')}
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder={t('register.email')}
                />
              ) : (
                <p className="text-white text-lg">{profile.email || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('profile.location')}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder={t('profile.location')}
                />
              ) : (
                <p className="text-white text-lg">{profile.address || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Age
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                />
              ) : (
                <p className="text-white text-lg">{profile.age || t('jobDetails.notSpecified')}</p>
              )}
            </div>

            {/* About Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('profile.bio')}
              </label>
              {isEditing ? (
                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-white text-base leading-relaxed">
                  {profile.about || t('jobDetails.notSpecified')}
                </p>
              )}
            </div>

            {/* Resume Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Resume
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <label className="flex items-center justify-center w-full px-4 py-6 bg-slate-700 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="flex flex-col items-center">
                      <FileText className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-300">
                        {resumeFile ? resumeFile.name : 'Click to upload resume (PDF or DOC)'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>
                  {profile.resume && !resumeFile && (
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <span className="text-sm text-gray-300 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Current resume uploaded
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {profile.resume ? (
                    <>
                      <FileText className="w-6 h-6 text-blue-400" />
                      <span className="text-white">Resume uploaded</span>
                      <a
                        href={profile.resume}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </>
                  ) : (
                    <p className="text-gray-400">No resume uploaded</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                {t('profile.updateProfile')}
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setPhotoFile(null);
                  setPreviewPhoto(null);
                  setResumeFile(null);
                }}
                className="flex-1 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                {t('jobDetails.back')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
