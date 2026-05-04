# Rozgaarsathi - Cloud Infrastructure Showcase

Rozgaarsathi is a modern web application designed to connect local talent with local opportunities, empowering workers and employers across India. 

**This repository highlights the Cloud Engineering, DevOps, and System Design aspects of the project.**

## 🚀 Cloud Engineering & DevOps Highlights

As a Cloud Engineer, my focus on this project was to establish a robust, scalable, and automated infrastructure. Key achievements include:

- **End-to-End CI/CD Pipeline**: Designed and implemented automated workflows using **GitHub Actions**. Code pushes automatically trigger testing, Docker image building, and deployment to production.
- **Containerization**: Fully containerized the application using **Docker**. Created independent `client` and `server` containers orchestrated via **Docker Compose**, ensuring parity between development and production environments.
- **AWS Infrastructure Deployment**: Provisioned and configured **AWS EC2** instances to host the application. Secured the server and configured SSH-based automated deployments.
- **Cloud Storage Integration**: Integrated **AWS S3** for scalable and secure storage of user-uploaded assets (resumes and profile pictures), offloading file storage from the application server.
- **Reverse Proxy & Web Server**: Configured **Nginx** to serve the optimized React frontend and act as a reverse proxy, routing API requests securely to the Node.js backend.

## 🏗️ System Architecture & Design

The application follows a microservices-inspired architecture running within a containerized environment on AWS. 

```mermaid
graph TD
    User([End User]) -->|HTTP/HTTPS| Proxy[Nginx Reverse Proxy]
    
    subgraph AWS Cloud
        subgraph EC2[AWS EC2 Instance]
            subgraph DockerNetwork[Docker Compose Network]
                Proxy -->|Static Files| Frontend[React Frontend Container]
                Proxy -->|/api requests| Backend[Node.js Backend Container]
            end
        end
        S3[("AWS S3 Bucket (Resumes & Images)")]
    end
    
    Backend -->|Read/Write| DB[("MongoDB")]
    Backend -->|Upload/Retrieve| S3

    classDef aws fill:#FF9900,stroke:#232F3E,stroke-width:2px,color:#fff;
    class S3,EC2 aws;
    classDef docker fill:#2496ED,stroke:#0db7ed,stroke-width:2px,color:#fff;
    class Frontend,Backend,Proxy docker;
```

## 🔄 CI/CD Pipeline Workflow

The continuous integration and continuous deployment pipeline is fully automated to ensure reliable and fast deployments. When code is merged to the `main` branch, the following sequence occurs:

```mermaid
sequenceDiagram
    participant Developer
    participant GitHub as GitHub Actions
    participant DockerHub as Docker Hub
    participant EC2 as AWS EC2 Server
    
    Developer->>GitHub: Push code to main
    GitHub->>GitHub: Checkout Code & Setup Environment
    GitHub->>GitHub: Build Client & Server Images
    GitHub->>DockerHub: Secure Login & Push Images
    GitHub->>EC2: Establish SSH Connection
    EC2->>EC2: git pull origin main (fetch configs)
    EC2->>DockerHub: docker compose pull
    EC2->>EC2: docker compose up -d (Restart Services)
```

1. **Build Phase**: GitHub Actions checks out the code and builds the Docker images for both the frontend (`rozgaarsathi-client`) and backend (`rozgaarsathi-server`).
2. **Registry Push**: The built images are securely tagged and pushed to **Docker Hub**.
3. **Deployment Phase**: GitHub Actions establishes an SSH connection to the **AWS EC2** instance using repository secrets.
4. **Orchestration**: The EC2 instance pulls the latest images and uses `docker compose up -d --build` to apply zero-downtime updates.

## 🛠️ Tech Stack & Tools

- **Cloud Provider**: AWS (EC2, S3)
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Web Server / Reverse Proxy**: Nginx
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## 📝 Running Locally

To spin up the entire infrastructure locally using Docker:

```bash
# Clone the repository
git clone https://github.com/yourusername/Rozgaarsathi.git
cd Rozgaarsathi

# Start the application using Docker Compose
docker-compose up --build
```
The application will be available at `http://localhost`, with the backend API accessible internally on port `3000`.

---
*This README focuses on the infrastructure and DevOps implementation. For detailed application code and features, please explore the `client` and `server` directories.*
