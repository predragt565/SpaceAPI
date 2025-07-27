# SpaceAPI – Planetary Exploration with FastAPI

This project is a simple but powerful API to manage planetary data using [FastAPI](https://fastapi.tiangolo.com/). It reads and stores structured planet data from JSON files and exposes RESTful endpoints for querying, creating, updating, and retrieving planet images.

The project consists of two parts:  
- Part One -  Project features and installation
- Part Two -  Building and re-installing images using Docker Hub

---

## Part One - Project features and installation

## 🚀 Features

- View all planets visually on website
- Get planet by ID
- Add a new planet (with auto-generated ID)
- Edit existing planets
- Update existing planets
- Serve planet image via HTTP (proxy)
- Data validation with Pydantic
- JSON-based storage (no database needed)
- Built-in data validation with Pydantic
- Swagger documentation `http://127.0.0.1:8000/docs`
- Beautiful UI using React + TailwindCSS

---

## 🧠 Technologies Used

### Backend

- **Python 3.10+**
- **FastAPI** for the web framework
- **Pydantic** for data validation
- **Uvicorn** as the ASGI server
- **Requests** for HTTP image proxying

### Frontend

- **React (Vite)**
- **TailwindCSS** for styling
- **Fetch API** for API communication

---

## 📁 Project Structure

```
📁SpaceAPI
    └── 📁 backend/
        ├── 📁 data/
        │   └── planets.json
        │
        ├── 📁 docs/
        │   ├── SpaceAPI-creating-image-package.txt
        │   └── SpaceAPI-starting-the-servers-txt
        │
        ├── 📁 src/
        │   └── 📁 space/
        │       └── main.py
        │
        └── 📁 utilities/
            └── data_load_func.py
        │
        ├── dockerfile
        ├── init_data.sh
        └── pyproject.toml

        
    ├── 📁 frontend/
        ├── 📁 src/
        │   ├── 📁 assets/
        │   │   └── react.svg
        │   │
        │   ├── 📁 components/
        │   │   ├── AddPlanetForm.jsx
        │   │   ├── EditPlanetForm.jsx
        │   │   ├── PlanetCard.jsx
        │   │   └── PlanetList.jsx
        │   │
        │   ├── App.jsx
        │   ├── App.css
        │   ├── index.css
        │   └── main.jsx
        │
        ├── dockerfile
        └── index.html

    ├── 📁 installation/
        ├── docker-down.cmd
        ├── docker-extract.cmd
        ├── docker-restart.cmd
        ├── dockerhubpull.cmd
        └── publish.cmd
    │
    ├── docker-compose.yml
    ├── docker-compose-deploy.yml
    ├── readme-installation.md
    ├── README.md
    ├── requirements.txt
    └── sync-data-from-volume.cmd
```


---

## 🔧 Setup & Run

### Backend

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd backend
    ```

2. **Create a virtual enviroment**

    ```bash
    python -m venv .venv
    venv\Scripts\activate
    ```

3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the server:**

    ```bash
    uvicorn src.space.main:app --reload
    ```

Server runs at: `http://localhost:8000/docs`

### Frontend

1. **Go to frontend folder:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Start dev server:**

    ```bash
    npm run dev
    ```

App runs at: `http://localhost:5173`

## 📡 API-Endpoints

| Method | Endpoint                         | Description              |
|--------|----------------------------------|--------------------------|
| GET    | `/planets`                       | List all planets         |
| GET    | `/planets/{planet_id}`           | Get single planet by ID  |
| POST   | `/planets`                       | Add new planet           |
| PUT    | `/planets/{planet_id}`           | Update existing planet   |
| DELETE | `/planets/{planet_id}`           | Delete a planet          |
| GET    | `/planets/{planet_id}/image`     | Proxy image from URL     |

---

``

## Part Two - Building and re-installing images using Docker Hub

## 🚀 SpaceAPI Project - Docker Compose Overview

This repository contains two `docker-compose` configurations designed for managing the **SpaceAPI** project lifecycle:

1. **`docker-compose.yml`** – The **build configuration**, used to build the project's Docker images (from local source code) and publish them to Docker Hub.
2. **`docker-compose-deploy.yml`** – The **deployment configuration**, used to pull prebuilt images from Docker Hub and recreate the project in a new environment, including containers and persistent volumes.

The project deployment structure is organized as follows:

```
SpaceAPI/
├── backend/ # Backend service code and documentation
│    └── docs/ # Exported docs mounted in container
├── frontend/ # Frontend service code
├── installation/ # Installation and command files
│    ├── publish.cmd # Script to build and push images to Docker Hub
│    └── dockerhubpull.cmd # Script to pull images and deploy on a new machine
├── docker-compose.yml # Build and local development setup
└── docker-compose-deploy.yml # Deployment setup from Docker Hub - production version
```
---

## **Procedures**

### **1. Build & Publish to Docker Hub**
To build images from local source code and push them to Docker Hub:

1. **Run the following command in the \installation\ folder**:
   ```bash
   .\publish.cmd
   ```

2. When prompted, enter Docker Hub username, tags.

This script will:

- Build `backend` and `frontend` images using `docker-compose.yml`
- Tag them with the specified Docker Hub username and version
- Push them to Docker Hub for distribution

---

### 2. Pull & Deploy on a New Machine

To pull the prebuilt images from Docker Hub and set up the project on a fresh environment:

1. Ensure **Docker** and **Docker Compose** are installed on the new machine.
2. Create a root folder (e.g., `SpaceAPI_test`) and place the following files in it:
   - `docker-compose-deploy.yml`
3. Create a subfolder \installation\ and place the following files in it:
   - `dockerhubpull.cmd`
   - `docker-extract.cmd`
   - `docker-down.cmd`
   - `docker-restart.cmd`
4. Run the following command:
   ```bash
   .\installation\dockerhubpull.cmd
   ```
5. When prompted, enter Docker Hub username, tags of a version you want to pull

This script will:

- Pull the images (with correct version tags) from Docker Hub
- Recreate `backend` and `frontend` containers
- Set up persistent volumes (e.g., `spaceapi-data`) and mappings
- Start the services with `docker compose up -d`


## 🔍 Side-by-Side Comparison - Compatibility for `publish.cmd`

| Config Element     | `docker-compose.yml` (Original)               | `docker-compose-deploy.yml` (Deployment)   | ✅ Compatible for `publish.cmd`?      |
| ------------------ | --------------------------------------------- | ------------------------------------------ | ------------------------------------ |
| **Image**          | `spaceapi-backend` (built locally)            | `${BACKEND_IMAGE}` (pulled from Hub)       | ✅ Yes (image doesn't affect publish) |
| **Container Name** | `spaceapi-backend`                            | `spaceapi-backend`                         | ✅ Yes (names match)                  |
| **Volumes**        | `spaceapi-data:/data` + bind `./backend/docs` | `spaceapi-data:/data` + bind `./backend/docs` | ✅ Yes                                |
| **Ports**          | `8000:8000`, `5173:80`                                   | `8000:8000`, `"5173:80"`                                | ✅ Yes                                |
| **Build**          | Yes (`build:` section present)                | ❌ None — uses prebuilt image               | ✅ Yes (not relevant to publish)      |
| **Restart Policy** | Not specified                                 | `restart: unless-stopped`                  | ✅ Yes (non-blocking difference)      |


## 1. Backend Service Comparison

| **Aspect**        | **docker-compose.yml (Original)**                                   | **docker-compose-deploy.yml (Deployment)**            | **Difference / Impact**                                                                                   |
|-------------------|----------------------------------------------------------------------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **image**         | `spaceapi-backend`                                                   | `${BACKEND_IMAGE}` (e.g., `spaceapi-backend:v1.0.1`)    | Deployment allows **dynamic tag/versioning** via `.env`. Original uses a fixed local image name.          |
| **pull_policy**    | `never`                                                             | _Not defined_                                          | Original requires a **local build** and forbids pulls. Deployment will pull the image if not present.     |
| **container_name** | `spaceapi-backend`                                                  | `spaceapi-backend`                                     | **Same** — container name remains consistent (important for scripts like `publish.cmd`).                  |
| **build**          | `context: ./backend`, `dockerfile: dockerfile`, `target: runner`    | _Not present_                                          | Deployment uses **prebuilt images** from Hub and skips the build step.                                    |
| **ports**          | `8000:8000`                                                         | `"8000:8000"`                                          | Same port mapping (quotes are optional in YAML).                                                          |
| **volumes**        | `spaceapi-data:/data`, `./backend/docs:/export-docs`                | `spaceapi-data:/data`, `./backend/docs:/export-docs`   | Same — persistent volume and bind mount are preserved.                                                    |
| **restart**        | _Not specified_                                                     | `unless-stopped`                                       | Deployment automatically restarts containers if they stop or crash.                                       |

---

## 2. Frontend Service Comparison

| **Aspect**        | **docker-compose.yml (Original)**             | **docker-compose-deploy.yml (Deployment)**          | **Difference / Impact**                                                                                   |
|-------------------|------------------------------------------------|------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| **image**         | `spaceapi-frontend`                            | `${FRONTEND_IMAGE}` (e.g., `spaceapi-frontend:v1.0.1`) | Deployment allows **dynamic tag/versioning** via `.env`. Original uses a fixed local image name.          |
| **pull_policy**    | `never`                                        | _Not defined_                                        | Original requires a **local build** and forbids pulls. Deployment will pull the image if not present.     |
| **container_name** | `spaceapi-frontend`                           | `spaceapi-frontend`                                  | **Same** — container name remains consistent.                                                             |
| **build**          | `context: ./frontend`, `dockerfile: dockerfile` | _Not present_                                        | Deployment uses **prebuilt images** from Hub.                                                             |
| **ports**          | `5173:80`                                     | `"5173:80"`                                          | Same port mapping (quotes are optional in YAML).                                                          |
| **volumes**        | _None_                                        | _None_                                               | Same (frontend doesn’t use a volume).                                                                     |
| **restart**        | _Not specified_                               | `unless-stopped`                                     | Deployment automatically restarts frontend if it stops or crashes.                                        |

---

## 3. Volumes Comparison

| **Aspect**        | **docker-compose.yml (Original)** | **docker-compose-deploy.yml (Deployment)** | **Difference / Impact**              |
|-------------------|----------------------------------|--------------------------------------------|--------------------------------------|
| **spaceapi-data** | Defined                          | Defined                                    | Same — persistent data is retained.  |


---

## 4. Summary of Key Differences

#### **Build vs Pull**
- Original Compose builds images locally using `build:`.
- Deployment Compose uses prebuilt images from Docker Hub (specified via `${BACKEND_IMAGE}` and `${FRONTEND_IMAGE}` in `.env`).

#### **Image Versioning**
- Original uses fixed image names (`spaceapi-backend`, `spaceapi-frontend`).
- Deployment supports version tags (`spaceapi-backend:v1.0.1`) — better for upgrades.

#### **Pull Policy**
- Original forbids pulls (`pull_policy: never`).
- Deployment allows pulling if the image is missing.

#### **Restart Policy**
- Deployment adds `restart: unless-stopped` for better reliability.

#### **Container Names**
- Identical in both files: `spaceapi-backend` and `spaceapi-frontend`.
- ➝ This means `publish.cmd` can safely reuse container names without modification.
