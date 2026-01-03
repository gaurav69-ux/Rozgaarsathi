import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

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



function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* All Routes - No Protection */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/jobseeker/profile" element={<JobSeekerProfile />} />
        <Route path="/jobseeker/nearby-jobs" element={<NearbyJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/employer/profile" element={<EmployerProfile />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/employer/applications" element={<EmployerApplications />} />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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