@echo off
setlocal ENABLEEXTENSIONS

REM Always run from project root
cd /d "%~dp0.."
echo Running from: %cd%

echo IMPORTANT! - Make sure you're logged into Docker Hub with: docker login
pause


REM === Prompt for Docker Hub username ===
set /p DOCKER_USERNAME=INPUT - Enter your Docker Hub username:
if "%DOCKER_USERNAME%"=="" (
    echo ERROR: No username provided. Exiting.
    exit /B 1
)

REM === Prompt for image tag (default: latest) ===
set /p IMAGE_TAG=INPUT - Enter image tag (default: latest): 
if "%IMAGE_TAG%"=="" (
    set IMAGE_TAG=latest
)

REM ======= CONFIGURATION =======
set BACKEND_IMAGE_NAME=docker.io/%DOCKER_USERNAME%/spaceapi-backend
set FRONTEND_IMAGE_NAME=docker.io/%DOCKER_USERNAME%/spaceapi-frontend
REM =============================

REM === Prompt user: Sync JSON or not ===
set /p SYNC_CHOICE=Do you want to sync the latest 'planets.json' from the Volume to the Backend container? (y/n): 
IF /I "%SYNC_CHOICE%"=="Y" (
    echo RUN - Syncing updated JSON from running container...
    call sync-data-from-volume.cmd
    IF %ERRORLEVEL% NEQ 0 (
        echo ERROR - Failed to sync JSON. Exiting.
        exit /B 1
    )
) ELSE (
    echo EXCEPTION -  Skipping sync step as requested.
)

REM === Clean up containers AFTER sync ===
echo RUN - Cleaning up old containers...
docker compose down

REM === Build backend and frontend ===
echo RUN - Rebuilding backend and frontend images...

docker compose build --no-cache backend
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR - Backend build failed. Exiting.
    exit /B 1
)

docker compose build --no-cache frontend
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR - Frontend build failed. Exiting.
    exit /B 1
)

REM === Tag backend ===
echo Tagging backend image...
docker tag spaceapi-backend %BACKEND_IMAGE_NAME%:%IMAGE_TAG%
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR - Failed to tag backend image. Exiting.
    exit /B 1
)

REM === Tag frontend ===
echo Tagging frontend image...
docker tag spaceapi-frontend %FRONTEND_IMAGE_NAME%:%IMAGE_TAG%
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR - Failed to tag frontend image. Exiting.
    exit /B 1
)

REM === Push backend ===
echo Pushing backend to Docker Hub...
docker push %BACKEND_IMAGE_NAME%:%IMAGE_TAG%
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR - Failed to push backend image. Exiting.
    exit /B 1
)

REM === Push frontend ===
echo Pushing frontend to Docker Hub...
docker push %FRONTEND_IMAGE_NAME%:%IMAGE_TAG%
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR - Failed to push frontend image. Exiting.
    exit /B 1
)

echo END - Publish complete!
endlocal
