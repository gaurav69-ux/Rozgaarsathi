# Job Portal Project

A modern, full-stack Job Portal application designed for Job Seekers and Employers.

## 🚀 Overview

This project is a comprehensive platform where:
- **Job Seekers** can find nearby jobs, save listings, and apply with their resumes.
- **Employers** can post jobs, manage their postings, and view applicant profiles.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, i18next (Multi-language support), Lucide React (Icons).
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT (Authentication).
- **Storage**: AWS S3 integration (ready for implementation).

## 📂 Project Structure

- `/client`: React frontend application.
- `/server`: Node.js Express API.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed.
- MongoDB instance (Local or Atlas).

### 2. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `example.env` and fill in your details:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT=3000`
   - `CLIENT_URL=http://localhost:5173`
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `example.env`:
   - `VITE_API_URL=http://localhost:3000/api`
4. Start the development server: `npm run dev`

## 🌟 Key Features
- **Dynamic Forms**: Registration fields change based on user role (Employer/Jobseeker).
- **Profile Management**: Full profile editing for both user types.
- **Multi-language**: Supports English and Hindi.
- **Responsive UI**: Optimized for mobile and desktop screens.
- **Real-time Feedback**: Clear error messages and loading states for better UX.

## 🛡️ License
Distributed under the MIT License.
