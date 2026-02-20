import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useTranslation } from 'react-i18next';
import Background from '../../components/common/Background';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'jobseeker'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      // After successful registration, send user to login page
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('register.title')}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                {t('register.fullName')}
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                {t('register.email')}
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                {t('register.password')}
              </label>
              <input
                type="password"
                placeholder={t('register.passwordMinimum')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                {t('register.phone')}
              </label>
              <input
                type="tel"
                placeholder="1234567890"
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                {t('register.role')}
              </label>
              <select
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="jobseeker">{t('register.jobseeker')}</option>
                <option value="employer">{t('register.employer')}</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('register.registering') : t('register.register')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-purple-300">{t('register.alreadyAccount')} </span>
            <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
              {t('register.login')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;