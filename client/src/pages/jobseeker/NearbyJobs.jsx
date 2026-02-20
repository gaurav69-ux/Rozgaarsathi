import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader, AlertCircle, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import Background from '../../components/common/Background';
import Navbar from '../../components/common/Navbar';
import JobCard from '../../components/common/jobCard';
import { useAuth } from '../../context/authContext';

const NearbyJobs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // Check authentication
  useEffect(() => {
    // Wait for auth context to finish loading
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'jobseeker') {
      navigate('/');
      return;
    }
  }, [authLoading, isAuthenticated, user, navigate, t]);

  // Fetch user profile to get location
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/jobseeker/profile');
        if (response.data.profile?.location) {
          setUserLocation(response.data.profile.location);
          setSelectedLocation(response.data.profile.location);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, authLoading]);

  // Fetch all active jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/jobs', {
          params: {
            limit: 100, // Get more jobs to filter locally
            page: 1,
            status: 'active'
          }
        });

        if (response.data.success) {
          setJobs(response.data.jobs);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchJobs();
    }
  }, [isAuthenticated, authLoading]);

  // Fetch saved jobs
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await api.get('/jobseeker/saved-jobs');
        if (response.data.savedJobs) {
          setSavedJobs(response.data.savedJobs.map(job => job._id));
        }
      } catch (err) {
        console.error('Failed to fetch saved jobs:', err);
      }
    };

    if (isAuthenticated && !authLoading) {
      fetchSavedJobs();
    }
  }, [isAuthenticated, authLoading]);

  // Filter jobs by location and title
  useEffect(() => {
    let filtered = jobs;

    // Filter by selected location
    if (selectedLocation) {
      filtered = filtered.filter(job =>
        job.location && job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filter by job title
    if (searchTitle) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, selectedLocation, searchTitle]);

  const handleSaveToggle = (jobId) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  return (
    <>
      <Background />
      <Navbar />
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('nearbyJobs.title')}
            </h1>
            <p className="text-gray-400">
              {t('nearbyJobs.subtitle')}
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  <MapPin className="inline w-4 h-4 mr-2" />
                  {t('nearbyJobs.location')}
                </label>
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="">{t('nearbyJobs.allLocations')}</option>
                  {Array.from(new Set(jobs.map(job => job.location).filter(Boolean))).map(
                    location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    )
                  )}
                </select>
                {userLocation && selectedLocation === userLocation && (
                  <p className="text-xs text-purple-300 mt-1">
                    📍 {t('nearbyJobs.yourProfileLocation')}
                  </p>
                )}
              </div>

              {/* Title Search Filter */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  <Search className="inline w-4 h-4 mr-2" />
                  {t('nearbyJobs.jobTitle')}
                </label>
                <input
                  type="text"
                  placeholder={t('nearbyJobs.searchPlaceholder')}
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">{t('nearbyJobs.loadingJobs')}</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 flex items-center space-x-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* No Jobs Found */}
          {!loading && !error && filteredJobs.length === 0 && (
            <div className="text-center py-20">
              <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {t('nearbyJobs.noJobsFound')}
              </h3>
              <p className="text-gray-500">
                {selectedLocation || searchTitle
                  ? t('nearbyJobs.tryAdjusting')
                  : t('nearbyJobs.noJobsAvailable')}
              </p>
            </div>
          )}

          {/* Jobs Grid */}
          {!loading && !error && filteredJobs.length > 0 && (
            <>
              <div className="mb-6 text-gray-400">
                {t('nearbyJobs.found')} <span className="font-semibold text-purple-400">{filteredJobs.length}</span> {t('nearbyJobs.nearby')}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job._id}
                    job={job}
                    initialSaved={savedJobs.includes(job._id)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NearbyJobs;
