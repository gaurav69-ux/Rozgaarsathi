import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Rocket, LogOut, Briefcase, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              RozgaarSathi
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <span className="text-purple-300">Welcome, {user?.name}</span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                  {user?.role}
                </span>
                {user?.role === 'employer' ? (
                  // For employer: hide Profile button on /employer/profile,
                  // hide Dashboard button on /employer/dashboard
                  <>
                    {(location.pathname === '/employer/profile' || location.pathname.startsWith('/employer/profile')) ? (
                      <Link
                        to="/employer/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all border border-purple-500/30"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                    ) : (location.pathname === '/employer/dashboard' || location.pathname.startsWith('/employer/dashboard')) ? (
                      <Link
                        to="/employer/profile"
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-800/40 hover:bg-slate-800/50 text-purple-300 rounded-lg transition-all border border-purple-500/20"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/employer/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all border border-purple-500/30"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/employer/profile"
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-800/40 hover:bg-slate-800/50 text-purple-300 rounded-lg transition-all border border-purple-500/20"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
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
                      <span>Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/jobseeker/profile"
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all border border-purple-500/30"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  )
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all border border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
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
                <div className="text-purple-300">Welcome, {user?.name}</div>
                <div className="text-sm text-purple-300">{user?.role}</div>
                {user?.role === 'employer' ? (
                  <>
                    {(location.pathname === '/employer/profile' || location.pathname.startsWith('/employer/profile')) ? (
                      <Link to="/employer/dashboard" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">Dashboard</Link>
                    ) : (location.pathname === '/employer/dashboard' || location.pathname.startsWith('/employer/dashboard')) ? (
                      <Link to="/employer/profile" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">Profile</Link>
                    ) : (
                      <>
                        <Link to="/employer/dashboard" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">Dashboard</Link>
                        <Link to="/employer/profile" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">Profile</Link>
                      </>
                    )}
                  </>
                ) : (
                  (location.pathname === '/jobseeker/profile' || location.pathname.startsWith('/jobseeker/profile')) ? (
                    <Link to="/jobseeker/dashboard" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">Dashboard</Link>
                  ) : (
                    <Link to="/jobseeker/profile" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">Profile</Link>
                  )
                )}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-red-300 hover:bg-red-500/10">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-lg text-purple-300 hover:bg-purple-500/10">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 to-pink-500">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;