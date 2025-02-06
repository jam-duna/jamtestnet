#!/bin/bash
set -e

CONTAINER_NAME="importblocks_container"
REGISTRY="us-central1-docker.pkg.dev"
REPOSITORY="importblocks"
BINARY="importblocks"
PROJECT="jam-duna"
IMAGE="${REGISTRY}/${PROJECT}/${REPOSITORY}/${BINARY}:latest"

echo "Stopping container ${CONTAINER_NAME} if it exists..."
docker stop "${CONTAINER_NAME}" 2>/dev/null || echo "Container ${CONTAINER_NAME} is not running."

echo "Removing container ${CONTAINER_NAME} if it exists..."
docker rm "${CONTAINER_NAME}" 2>/dev/null || echo "Container ${CONTAINER_NAME} does not exist."

#gcloud auth configure-docker us-central1-docker.pkg.dev might be needed
echo "Pulling image ${IMAGE} from GAR..."
docker pull "${IMAGE}"

echo "Running new container ${CONTAINER_NAME} using image ${IMAGE}..."
docker run -d --name "${CONTAINER_NAME}" --hostname "${CONTAINER_NAME}" "${IMAGE}"

echo "Getting started with:"
echo  "docker exec -it "${CONTAINER_NAME}" ./${BINARY} --mode=safrole --http='http://imeplementation.jamduna.org:8088' --invalidrate=0.31459 --numblocks=50 --statistics=25"
docker exec -it "${CONTAINER_NAME}" ./${BINARY} --help