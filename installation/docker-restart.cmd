@echo off
setlocal

REM Always run from project root
cd /d "%~dp0.."
echo Running from: %cd%
echo.

REM === Set default project name and compose file ===
set PROJECT_NAME=spaceapi
set COMPOSE_FILE=docker-compose-deploy.yml
set ENV_FILE=.env

echo ===================================================
echo Docker Compose RESTART Helper
echo Project: %PROJECT_NAME%
echo Compose file: %COMPOSE_FILE%
echo ===================================================
echo.

REM === Check if .env file exists ===
if not exist "%ENV_FILE%" (
    echo [ERROR] .env file not found in %cd%.
    echo Please run dockerhubpull.cmd first to create and pull images.
    exit /b 1
)

REM === Stop containers (without removing volumes) ===
echo [INFO] Stopping containers for project "%PROJECT_NAME%"...
docker compose -p %PROJECT_NAME% -f %COMPOSE_FILE% down
if errorlevel 1 (
    echo [ERROR] Failed to stop containers.
    exit /b 1
)

REM === Start containers again ===
echo [INFO] Restarting containers with compose file "%COMPOSE_FILE%"...
docker compose -f %COMPOSE_FILE% -p %PROJECT_NAME% --env-file %ENV_FILE% up -d
if errorlevel 1 (
    echo [ERROR] Failed to start containers.
    exit /b 1
)

REM === Show current container status ===
echo.
echo [INFO] Containers are running:
docker compose -p %PROJECT_NAME% -f %COMPOSE_FILE% ps

endlocal
@REM pause
