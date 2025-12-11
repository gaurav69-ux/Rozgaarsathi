import { useState } from 'react';
import { MapPin, DollarSign, Clock, Building, Heart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const JobCard = ({ job, onSaveToggle, initialSaved = false }) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleSave = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      navigate('/login');
      return;
    }

    if (user?.role !== 'jobseeker') {
      toast.error('Only job seekers can save jobs');
      return;
    }

    setSaving(true);
    try {
      await api.post(`/jobs/${job._id}/save`);
      setIsSaved(!isSaved);
      if (onSaveToggle) onSaveToggle(job._id);
      toast.success(isSaved ? 'Job removed from saved list' : 'Job saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <div 
      className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center space-x-2 text-purple-300 mb-2">
            <Building className="w-4 h-4" />
            <span>{job.employerId?.name || 'Company'}</span>
          </div>
        </div>
        {isAuthenticated && user?.role === 'jobseeker' && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-all"
          >
            <Heart 
              className={`w-5 h-5 ${isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-400'} ${saving ? 'opacity-50' : ''}`} 
            />
          </button>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        {job.location && (
          <div className="flex items-center text-gray-300 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-purple-400" />
            {job.location}
          </div>
        )}
        {job.salary?.min && job.salary?.max && (
          <div className="flex items-center text-gray-300 text-sm">
            <DollarSign className="w-4 h-4 mr-2 text-purple-400" />
            {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
          </div>
        )}
        <div className="flex items-center text-gray-300 text-sm">
          <Clock className="w-4 h-4 mr-2 text-purple-400" />
          {job.jobType}
        </div>
      </div>
      
      {job.category && (
        <div className="mb-4">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30">
            {job.category}
          </span>
        </div>
      )}
      
      <button 
        className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
        onClick={handleViewDetails}
      >
        <span>View Details</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default JobCard;