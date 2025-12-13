import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/common/Navbar';

export default function JobSeekerProfile() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    address: '',
    age: '',
    about: '',
    profilePhoto: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  // Redirect to login if not authenticated (after auth loading is complete)
  useEffect(() => {
    if (!authLoading && !token) {
      toast.error('Please login first');
      navigate('/login');
    }
  }, [authLoading, token, navigate]);

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
      };

      setProfile(updatedProfile);
      setPhotoFile(null);
      setPreviewPhoto(null);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Save error:', error.response?.data || error.message);
      const message = error.response?.data?.message || error.message || 'Failed to update profile';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <p className="text-white text-lg">Loading profile...</p>
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
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-white text-lg">{profile.name || 'Not provided'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your email"
                />
              ) : (
                <p className="text-white text-lg">{profile.email || 'Not provided'}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter your address"
                />
              ) : (
                <p className="text-white text-lg">{profile.address || 'Not provided'}</p>
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
                <p className="text-white text-lg">{profile.age || 'Not provided'}</p>
              )}
            </div>

            {/* About Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                About
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
                  {profile.about || 'No description provided'}
                </p>
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
                Save Changes
              </button>
              
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPhotoFile(null);
                  setPreviewPhoto(null);
                }}
                className="flex-1 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
