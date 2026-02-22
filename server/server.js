const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000"
  ],
  credentials: true
}));


// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
const buildPath = path.resolve(__dirname, '../client/dist');
app.use(express.static(buildPath));

// Import and use routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobseeker', require('./routes/jobSeekerRoutes'));
app.use('/api/employer', require('./routes/employerRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ message: '🚀 Job Portal API is running', status: 'active' });
});

// Serve frontend index.html for unknown routes (SPA)
app.use((req, res) => {
  // If it's an API route that wasn't matched, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API Route not found' });
  }
  // Otherwise, serve index.html
  const indexPath = path.join(buildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status(404).json({ message: 'Frontend build not found or API route not found' });
      }
    }
  });
});


// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});



// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});




