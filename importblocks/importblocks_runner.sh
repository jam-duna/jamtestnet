#!/bin/bash
set -e

CONTAINER_NAME="importblocks_container"
IMAGE="us-central1-docker.pkg.dev/jam-duna/importblocks/importblocks:latest"

echo "Stopping container ${CONTAINER_NAME}..."
docker stop "${CONTAINER_NAME}" 2>/dev/null || echo "No container ${CONTAINER_NAME} running."

echo "Removing container ${CONTAINER_NAME}..."
docker rm "${CONTAINER_NAME}" 2>/dev/null || echo "No container ${CONTAINER_NAME} found."

echo "Pulling image ${IMAGE}..."
docker pull "${IMAGE}"

echo "Starting new container ${CONTAINER_NAME}..."
docker run -d --name "${CONTAINER_NAME}" --hostname "${CONTAINER_NAME}" "${IMAGE}"

echo "To execute importblocks, run:"
echo "docker exec -it ${CONTAINER_NAME} ./importblocks --mode=assurances --http='http://yourimplementation:8099/' --invalidrate=0.31459 --numblocks=50 --statistics=25"

echo "To open an interactive shell, run:"
echo "docker exec -it ${CONTAINER_NAME} /bin/bash"