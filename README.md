# Job Portal Project

A modern, full-stack Job Portal application designed for Job Seekers and Employers.

## 🚀 Overview
This project is a comprehensive platform where:
- **Job Seekers** can find nearby jobs, save listings, and apply with their resumes.
- **Employers** can post jobs, manage their postings, and view applicant profiles.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, i18next.
- **Backend**: Node.js (Express 5), MongoDB, JWT.
- **Storage**: AWS S3 integration.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Standard Setup
1. `npm install` (in root)
2. `npm run dev` (starts both client and server)

## 🌐 Production Deployment (AWS EC2 / Linux)

Linux is **case-sensitive**, so follow these steps carefully:

### 1. Build the Frontend
```bash
cd client
npm install
npm run build
```

### 2. Start Backend with PM2
```bash
cd server
npm install
npm install -g pm2
pm2 start server.js --name "job-portal-api"
```

### 3. Nginx Configuration
We recommend using Nginx on port 80 to serve the frontend and proxy the API.

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /home/ubuntu/job-portal/client/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 🛡️ Troubleshooting (Express 5)
If you see `PathError` in logs, ensure all wildcard routes use `/*` instead of `*`. This project is optimized for Express 5.

## 🛡️ License
Distributed under the MIT License.
