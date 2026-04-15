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
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData);

    if (result.success) {
      // After successful registration, send user to login page
      navigate('/login');
    } else {
      setError(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-md w-full shadow-2xl my-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
            {t('register.title')}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('register.role')}
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-blue-500 transition-all"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="jobseeker">👷‍♂️ {t('jobseeker / नौकरी ढूंढने वाला ')}</option>
                <option value="employer">🧑‍💼 {t('employer / नौकरी देने वाला ')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.role === 'employer' ? 'Employer Name/नियोक्ता का नाम' : t('FullName/ पूरा नाम')}
              </label>
              <input
                type="text"
                placeholder={t('register.fullName')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {formData.role === 'employer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Business Name/कंपनी/व्यापार का नाम
                </label>
                <input
                  type="text"
                  placeholder="Enter your company name"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email/ईमेल')}
              </label>
              <input
                type="email"
                placeholder={t('example@gmail.com')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number/मोबाइल नं.
              </label>
              <input
                type="tel"
                placeholder="+91 1234567890"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.role === 'employer' ? 'Create Password / पासवर्ड बनाएं' : 'Create Password / पासवर्ड बनाएं'}
              </label>
              <input
                type="password"
                placeholder={t('register.password')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('register.registering') : t('register.register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">{t('register.alreadyAccount')} </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
              {t('register.login')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;