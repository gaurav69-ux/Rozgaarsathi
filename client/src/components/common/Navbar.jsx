import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { Rocket, LogOut, Briefcase, User, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 border-b border-blue-500 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">
              RozgaarSathi
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-blue-100">{t('navbar.welcome')}, {user?.name}</span>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm border border-white/30">
                  {user?.role}
                </span>
                {user?.role === 'employer' ? (
                  // For employer: hide Profile button on /employer/profile,
                  // hide Dashboard button on /employer/dashboard
                  <>
                    {(location.pathname === '/employer/profile' || location.pathname.startsWith('/employer/profile')) ? (
                      <Link
                        to="/employer/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all border border-white/30"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>{t('navbar.dashboard')}</span>
                      </Link>
                    ) : (location.pathname === '/employer/dashboard' || location.pathname.startsWith('/employer/dashboard')) ? (
                      <Link
                        to="/employer/profile"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all border border-blue-500/50"
                      >
                        <User className="w-4 h-4" />
                        <span>{t('navbar.profile')}</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/employer/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all border border-purple-500/30"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>{t('navbar.dashboard')}</span>
                        </Link>
                        <Link
                          to="/employer/profile"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all border border-blue-500/50"
                        >
                          <User className="w-4 h-4" />
                          <span>{t('navbar.profile')}</span>
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  (location.pathname === '/jobseeker/profile' || location.pathname.startsWith('/jobseeker/profile')) ? (
                    <Link
                      to="/jobseeker/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all border border-purple-500/30"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>{t('navbar.dashboard')}</span>
                    </Link>
                  ) : (
                    <Link
                      to="/jobseeker/profile"
                      className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all border border-white/30"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('navbar.profile')}</span>
                    </Link>
                  )
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all border border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('navbar.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-blue-100 transition-colors"
                >
                  {t('Login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-all shadow-sm"
                >
                  {t('Register')}
                </Link>
              </>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all border border-blue-500/50"
              >
                <Globe className="w-4 h-4" />
                <span className="font-semibold">{i18n.language.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 bg-slate-800 border border-purple-500/30 rounded-lg shadow-lg overflow-hidden z-10 min-w-32">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2 transition-colors ${i18n.language === 'en' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:bg-slate-700'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('hi')}
                    className={`w-full text-left px-4 py-2 transition-colors ${i18n.language === 'hi' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300 hover:bg-slate-700'}`}
                  >
                    हिंदी
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 text-purple-300 hover:text-purple-200"
              >
                <Globe className="w-5 h-5" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 bg-slate-800 border border-purple-500/30 rounded-lg shadow-lg overflow-hidden z-10">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === 'en' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('hi')}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${i18n.language === 'hi' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-300'}`}
                  >
                    हिंदी
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-md text-purple-300 hover:bg-purple-500/10"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/90 border-t border-purple-500/10">
          <div className="px-6 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="text-purple-300">{t('navbar.welcome')}, {user?.name}</div>
                <div className="text-sm text-purple-300">{user?.role}</div>
                {user?.role === 'employer' ? (
                  <>
                    {(location.pathname === '/employer/profile' || location.pathname.startsWith('/employer/profile')) ? (
                      <Link to="/employer/dashboard" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">{t('navbar.dashboard')}</Link>
                    ) : (location.pathname === '/employer/dashboard' || location.pathname.startsWith('/employer/dashboard')) ? (
                      <Link to="/employer/profile" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">{t('navbar.profile')}</Link>
                    ) : (
                      <>
                        <Link to="/employer/dashboard" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">{t('navbar.dashboard')}</Link>
                        <Link to="/employer/profile" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">{t('navbar.profile')}</Link>
                      </>
                    )}
                  </>
                ) : (
                  (location.pathname === '/jobseeker/profile' || location.pathname.startsWith('/jobseeker/profile')) ? (
                    <Link to="/jobseeker/dashboard" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">{t('navbar.dashboard')}</Link>
                  ) : (
                    <Link to="/jobseeker/profile" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">{t('navbar.profile')}</Link>
                  )
                )}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-red-300 hover:bg-red-500/10">{t('navbar.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">{t('navbar.login')}</Link>
                <Link to="/register" className="block px-3 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500">{t('navbar.register')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;