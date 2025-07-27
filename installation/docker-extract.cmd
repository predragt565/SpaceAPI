@echo off
setlocal

REM Always run from project root
cd /d "%~dp0.."
echo Running from: %cd%

REM === Prompt for Docker Hub username ===
set /p DOCKER_USERNAME=Enter your Docker Hub username: 
if "%DOCKER_USERNAME%"=="" (
    echo ERROR: No username provided.
    exit /b 1
)

REM === Prompt for image tag (default: latest) ===
set /p IMAGE_TAG=Enter image tag (default: latest): 
if "%IMAGE_TAG%"=="" set IMAGE_TAG=latest

set BACKEND_IMAGE=%DOCKER_USERNAME%/spaceapi-backend:%IMAGE_TAG%
set FRONTEND_IMAGE=%DOCKER_USERNAME%/spaceapi-frontend:%IMAGE_TAG%

echo.
echo === Extracting backend and frontend files from images ===

if not exist backend mkdir backend
if not exist frontend mkdir frontend
if not exist backend\data mkdir backend\data

REM Pull and extract backend files
docker pull %BACKEND_IMAGE%
docker create --name temp-backend %BACKEND_IMAGE%
docker cp temp-backend:/app/. backend
docker rm temp-backend

REM Pull and extract frontend files
docker pull %FRONTEND_IMAGE%
docker create --name temp-frontend %FRONTEND_IMAGE%
docker cp temp-frontend:/usr/share/nginx/html/. frontend
docker rm temp-frontend

echo.
echo === Copying planets.json from running backend container ===
docker ps --format "{{.Names}}" | findstr /I "spaceapi-backend" >nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: spaceapi-backend container is not running.
    echo Start it with: docker compose -f docker-compose-prod.yml up -d backend
) else (
    docker cp spaceapi-backend:/data/planets.json backend\data\planets.json
    echo planets.json copied successfully.
)

echo.
echo === Done. Backend in ./backend, Frontend in ./frontend ===
@REM pause
endlocal
