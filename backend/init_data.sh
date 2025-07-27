#!/bin/sh

# Only copy if not already in volume
if [ ! -f /data/planets.json ]; then
  echo "[init] Copying planets.json to /data..."
  mkdir -p /data
  cp /app/data/planets.json /data/planets.json
else
  echo "[init] planets.json already exists in /data — skipping copy."
fi

# Copy bundled docs to local folder (only if /export-docs is mounted)
if [ -d /export-docs ]; then
  echo "[init] Copying docs from image to ./backend/docs..."
  cp -u -r /app/docs/* /export-docs/
fi

# Run the actual command passed (uvicorn)
exec "$@"


# This script is used at container startup to make sure the Docker volume has an initial planets.json file, 
# copied from the image only if it doesn't already exist.

# The app stores data in /data/planets.json — which is a Docker volume mounted at /data
# When a Docker volume is first created, it's empty
# If the volume is empty, the app has no JSON data to serve
# So this script makes sure that /data/planets.json exists on first run by copying from the image's built-in copy

# Why it's a best practice:
    # Keeps the volume persistent and user-editable
    # Avoids accidental overwrites of user-edited data
    # Allows you to ship default data in your image without forcing it on every startup