@echo off
setlocal ENABLEDELAYEDEXPANSION

REM Always run from project root
cd /d "%~dp0.."
echo Running from: %cd%
echo.

REM === Set default project name ===
set "PROJECT_NAME=spaceapi"

echo ===================================================
echo Docker Compose DOWN Helper
echo Project: %PROJECT_NAME%
echo ===================================================
echo.

REM === Show containers for this project ===
echo [INFO] The following containers belong to the project "%PROJECT_NAME%":
docker ps -a --filter "name=%PROJECT_NAME%" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
echo.

REM === Show volumes for this project ===
echo [INFO] The following volumes belong to the project "%PROJECT_NAME%":
docker volume ls --filter "name=%PROJECT_NAME%"
echo.

@REM REM === Ask for confirmation ===
@REM set CONFIRM=
@REM set /p CONFIRM=Proceed with stopping and removing these containers? (y/n): 
@REM if /i "%CONFIRM%" NEQ "y" goto :CANCEL

REM === Ask user if volumes should be removed ===
set REMOVE_VOLUMES=
set /p REMOVE_VOLUMES=Do you want to remove associated volumes as well? (y/n): 
if /i "%REMOVE_VOLUMES%"=="y" goto :REMOVE_VOLUMES
goto :KEEP_VOLUMES

:REMOVE_VOLUMES
echo [INFO] Bringing down containers and removing volumes...
call docker compose -p %PROJECT_NAME% down --volumes
goto :CHECK_STATUS

:KEEP_VOLUMES
echo [INFO] Bringing down containers (volumes will remain)...
call docker compose -p %PROJECT_NAME% down
goto :CHECK_STATUS

:CHECK_STATUS
if errorlevel 1 (
    echo [ERROR] Failed to stop containers. Exiting.
    exit /b 1
)

echo.
echo ===================================================
echo Containers for project "%PROJECT_NAME%" have been stopped.
echo ===================================================

@REM REM === Optionally show Docker state ===
@REM set SHOW_STATE=
@REM set /p SHOW_STATE=Do you want to list all running containers and volumes now? (y/n): 
@REM if /i "%SHOW_STATE%"=="y" goto :SHOW_STATE

goto :END

:SHOW_STATE
echo [INFO] Listing containers:
docker ps -a
echo.
echo [INFO] Listing volumes:
docker volume ls
goto :END

:CANCEL
echo [INFO] Operation cancelled by user.
goto :END

:END
endlocal
@REM pause
