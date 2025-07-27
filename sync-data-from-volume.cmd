:: Run this .cmd script to sync the updated JSON data from the Docker container/volume 
:: back into your local backend/data/planets.json file before building a new image.

:: To run this script, open a 'PowerShell' or 'Cmd' Terminal window and 
:: run the following command: ./sync-data-from-volume.cmd


:: The ideal workflow becomes:
:: docker compose up            :: run the app and make edits via UI
:: ./sync-data-from-volume.cmd   :: extract changes back into backend/data
:: docker compose build backend :: include new json in image
:: docker push ...              :: publish new version


@echo off
setlocal

echo START - Syncing updated planets.json from running container...

:: Check if container is running
FOR /F "tokens=*" %%i IN ('docker ps --format "{{.Names}}"') DO (
    IF "%%i"=="spaceapi-backend" (
        GOTO :copyFile
    )
)

echo ERROR - 'spaceapi-backend' container is not running.
echo Start it with: docker compose up -d backend
exit /B 1

:copyFile
docker cp spaceapi-backend:/data/planets.json "backend\data\planets.json"

IF %ERRORLEVEL% NEQ 0 (
    echo ERROR - Failed to copy planets.json from container.
    exit /B %ERRORLEVEL%
)

echo SUCCESS - planets.json synced to backend\data\
endlocal
