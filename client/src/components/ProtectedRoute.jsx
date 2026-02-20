import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protects routes that require authentication
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner component
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Protects auth routes - prevents logged-in users from accessing login/register/home
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    if (user?.role === 'employer') {
      return <Navigate to="/employer/dashboard" replace />;
    }
    if (user?.role === 'jobseeker') {
      return <Navigate to="/jobseeker/dashboard" replace />;
    }
    // Fallback for unknown roles or if user object is not fully loaded yet but is authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protects jobseeker routes - only jobseekers can access
export const JobSeekerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'jobseeker' ? children : <Navigate to="/" replace />;
};

// Protects employer routes - only employers can access
export const EmployerRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return user?.role === 'employer' ? children : <Navigate to="/" replace />;
};
