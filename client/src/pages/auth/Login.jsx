import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useTranslation } from 'react-i18next';
import Background from '../../components/common/Background';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Navigate based on role
      if (result.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/jobseeker/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('login.title')}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                placeholder={t('login.email')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                placeholder={t('login.password')}
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('login.loggingIn') : t('login.login')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-purple-300">{t('login.noAccount')} </span>
            <Link to="/register" className="text-purple-400 hover:text-purple-300 transition-colors">
              {t('login.register')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;