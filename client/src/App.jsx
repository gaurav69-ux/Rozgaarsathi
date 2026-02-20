import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobSeekerDashboard from './pages/jobseeker/Dashboard';
import JobSeekerProfile from './pages/jobseeker/jobseekerprofile';
import NearbyJobs from './pages/jobseeker/NearbyJobs';
import JobDetails from './pages/jobseeker/job-details';
import EmployerProfile from './pages/employer/employerprofile';
import EmployerDashboard from './pages/employer/Dashboard';
import EmployerApplications from './pages/employer/applications';

// Protected Routes
import { PrivateRoute, PublicRoute, JobSeekerRoute, EmployerRoute } from './components/ProtectedRoute';



function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Only accessible when NOT logged in */}
        <Route path="/" element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* JobSeeker Routes - Only accessible by jobseekers */}
        <Route path="/jobseeker/dashboard" element={
          <JobSeekerRoute>
            <JobSeekerDashboard />
          </JobSeekerRoute>
        } />
        <Route path="/jobseeker/profile" element={
          <JobSeekerRoute>
            <JobSeekerProfile />
          </JobSeekerRoute>
        } />
        <Route path="/jobseeker/nearby-jobs" element={
          <JobSeekerRoute>
            <NearbyJobs />
          </JobSeekerRoute>
        } />

        {/* Job Details - Accessible by authenticated users (jobseekers can view) */}
        <Route path="/jobs/:id" element={
          <PrivateRoute>
            <JobDetails />
          </PrivateRoute>
        } />

        {/* Employer Routes - Only accessible by employers */}
        <Route path="/employer/profile" element={
          <EmployerRoute>
            <EmployerProfile />
          </EmployerRoute>
        } />
        <Route path="/employer/dashboard" element={
          <EmployerRoute>
            <EmployerDashboard />
          </EmployerRoute>
        } />
        <Route path="/employer/applications" element={
          <EmployerRoute>
            <EmployerApplications />
          </EmployerRoute>
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;