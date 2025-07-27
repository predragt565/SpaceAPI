@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Always run from project root
cd /d "%~dp0.."
echo Running from: %cd%

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

REM === Define variables ===
set BACKEND_IMAGE=%DOCKER_USERNAME%/spaceapi-backend:%IMAGE_TAG%
set FRONTEND_IMAGE=%DOCKER_USERNAME%/spaceapi-frontend:%IMAGE_TAG%
set COMPOSE_FILE=docker-compose-deploy.yml
set ENV_FILE=.env
set PROJECT_NAME=spaceapi

REM === STEP 1: Create .env file ===
echo Creating .env file...
echo BACKEND_IMAGE=%BACKEND_IMAGE%> %ENV_FILE%
echo FRONTEND_IMAGE=%FRONTEND_IMAGE%>> %ENV_FILE%
echo .env contents:
type %ENV_FILE%

REM === STEP 2: Pull images ===
echo Pulling backend image: %BACKEND_IMAGE%
docker pull %BACKEND_IMAGE%
if errorlevel 1 (
    echo ERROR: Failed to pull backend image.
    exit /b 1
)

echo Pulling frontend image: %FRONTEND_IMAGE%
docker pull %FRONTEND_IMAGE%
if errorlevel 1 (
    echo ERROR: Failed to pull frontend image.
    exit /b 1
)

REM === STEP 3: Ensure bind mount path exists ===
if not exist backend\docs (
    echo Folder 'backend\docs' not found. Creating it...
    mkdir backend\docs
)

REM === STEP 4: Start containers with consistent project name ===
echo Starting containers using project name: %PROJECT_NAME%
docker compose -p %PROJECT_NAME% -f %COMPOSE_FILE% --env-file %ENV_FILE% up -d --force-recreate --pull always
if errorlevel 1 (
    echo ERROR: Failed to start containers.
    exit /b 1
)

REM === STEP 5: Show container status ===
docker compose -p %PROJECT_NAME% -f %COMPOSE_FILE% ps

endlocal
@REM pause
