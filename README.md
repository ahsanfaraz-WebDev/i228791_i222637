MERN Application Deployment on Kubernetes with Minikube
Project Overview
This project, developed by Ahsan Faraz (I228791) and Gulsher Khan (I222637) for the Software Construction and Development course at the National University of Computer and Emerging Sciences, involves deploying a MERN (MongoDB, Express.js, React, Node.js) stack application on a local Kubernetes cluster using Minikube. The application, named GatherSpace, is a multi-page web platform for discovering and creating community events. The project covers environment setup, application development, containerization with Docker, Kubernetes deployment, CI/CD with GitHub Actions, and troubleshooting.

GitHub Repository: https://github.com/ahsanfaraz-WebDev/i228791_i222637
Technologies Used: MERN stack, Docker, Minikube, Kubernetes, GitHub Actions
Environment: Developed on Windows 11 Pro with Docker Desktop, Minikube, and kubectl

Project Phases

Minikube Installation: Set up a local Kubernetes cluster using Minikube and kubectl.
MERN App Creation: Developed a MERN application with a React frontend, Node.js/Express backend, and MongoDB database.
Dockerizing: Containerized the frontend and backend using Docker.
GitHub Push: Pushed code and Docker images to GitHub and Docker Hub.
Kubernetes Files: Created Kubernetes manifests for deployment.
Running Cluster: Deployed the application on the Minikube cluster.
Docker Hub: Pushed Docker images to Docker Hub.
CI/CD and Additional Configurations: Automated build and deployment with GitHub Actions.
Troubleshooting: Addressed challenges like Minikube service access, Docker Hub authentication, and resource management.

Prerequisites

Docker Desktop: Download
Minikube: Installation Guide
kubectl: Installation Guide
Node.js: For local development
Git: For cloning the repository

Setup Instructions
Running Locally with Docker

Clone the repository:git clone https://github.com/ahsanfaraz-WebDev/i228791_i222637.git
cd i228791_i222637


Ensure Docker Desktop is running.
Build Docker images for the frontend and backend:cd app/backend
docker build -t backend .
cd ../frontend
docker build -t frontend .


Run the application using Docker Compose:cd ../..
docker-compose up


Access the frontend at http://localhost:<port> (default port specified in docker-compose.yaml).

Running on Minikube

Start Docker Desktop.
Start Minikube with the Docker driver:minikube start --driver=docker


Apply Kubernetes manifests:kubectl apply -f k8s/


Expose the frontend service:minikube service frontend-service --url


Access the frontend at http://127.0.0.1:<port> (port provided by the above command).
(Optional) Enable Minikube tunnel for LoadBalancer services:minikube tunnel



Project Structure
i228791_i222637/
├── app/
│   ├── backend/           # Node.js/Express backend
│   ├── frontend/          # React frontend
├── k8s/                   # Kubernetes manifests
├── github/workflows/      # GitHub Actions workflows
├── docker-compose.yaml    # Docker Compose configuration
└── README.md

Troubleshooting
Common issues and solutions:

Minikube Service Access: Use minikube service <service-name> --url or configure an Ingress resource.
Docker Hub Authentication: Store credentials in CI/CD secrets and use a personal access token.
Container Resource Management: Set resource limits in Kubernetes YAML (e.g., memory: "512Mi", cpu: "500m").
Persistent Storage: Use PersistentVolume and PersistentVolumeClaim for MongoDB.
Node.js Dependency Conflicts: Pin versions in package.json and use npm ci.
Frontend Hot Reloading: Mount source code as a volume or configure Webpack HMR.

For detailed troubleshooting, refer to the project report sections on "Problems Encountered" and "Additional Issues."
Running Instructions Summary

Locally: Build and run with Docker Compose, access via localhost:<port>.
Minikube: Start Minikube, apply Kubernetes manifests, and access via 127.0.0.1:<port>.

Notes

Ensure sufficient resources for Minikube (recommended: 4 CPUs, 8GB memory).
Use minikube dashboard to monitor the cluster.
For CI/CD, configure GitHub Actions workflows in .github/workflows/.

