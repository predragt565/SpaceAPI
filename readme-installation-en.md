# SpaceAPI App – Installation and Command Guide

This guide describes the purpose of each `.cmd` file in the SpaceAPI project and when to use them.

---

## **Typical Workflow**
1. **Development & Publishing:**  
   Use `publish.cmd` to build and push new image versions.
2. **Deployment on Another Machine:**  
   Use `dockerhubpull.cmd` to pull and start the app from Docker Hub images.
3. **Extract Local Files (Optional):**  
   Use `docker-extract.cmd` to get backend/frontend files and `planets.json` locally.
4. **Stopping the App:**  
   Use `docker-down.cmd` to stop and remove containers.
5. **Restarting the App:**  
   Use `docker-restart.cmd` to bring containers back up without rebuilding.

---

## **1. `publish.cmd`**
- **Purpose:**  
  Builds, tags, and pushes the backend and frontend Docker images to Docker Hub.
- **When to Use:**  
  - After making changes to the source code (backend/frontend).
  - When you want to publish a new image version (e.g., `v1.0.2`).
- **Key Features:**  
  - Prompts for Docker Hub username and image tag.
  - Builds fresh images for backend and frontend.
  - Pushes the images to your Docker Hub repository.

---

## **2. `dockerhubpull.cmd`**
- **Purpose:**  
  Pulls pre-built backend and frontend images from Docker Hub and runs them on the local machine.
- **When to Use:**  
  - To deploy the app on a machine without rebuilding from source.
  - For production deployments using existing images.
- **Key Features:**  
  - Automatically pulls images using the provided Docker Hub username and tag.
  - Creates containers and starts the app.

---

## **3. `docker-extract.cmd`**
- **Purpose:**  
  Extracts app files and data from Docker images or containers to the local filesystem.
- **When to Use:**  
  - When you want a local copy of backend and frontend files from the published Docker images.
  - To retrieve `planets.json` from a running backend container.
- **Key Features:**  
  - Extracts backend `/app` files into `./backend`.
  - Extracts frontend build files into `./frontend`.
  - Copies the current `planets.json` from the running backend container (if available).

---

## **4. `docker-down.cmd`**
- **Purpose:**  
  Stops and removes all running containers, networks, and volumes associated with the SpaceAPI app.
- **When to Use:**  
  - Before updating or rebuilding containers.
  - When you want to free resources or shut down the entire app environment.
- **Key Features:**  
  - Runs `docker compose down` for the project.
  - Cleans up volumes if required (based on configuration).

---

## **5. `docker-restart.cmd`**
- **Purpose:**  
  Restarts the SpaceAPI containers without rebuilding images.
- **When to Use:**  
  - After temporarily stopping containers.
  - When you want to restart the app with the existing configuration and data.
- **Key Features:**  
  - Runs `docker compose restart` (or equivalent commands).
  - Does not rebuild or re-pull images — uses what’s already running locally.

---
