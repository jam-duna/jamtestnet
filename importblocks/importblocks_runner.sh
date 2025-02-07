#!/bin/bash
set -e

# Parse command-line arguments: mode, numblocks, invalidrate, statistics, http, host_ip.
for arg in "$@"; do
  case $arg in
    mode=*)
      MODE="${arg#mode=}"
      shift
      ;;
    numblocks=*)
      NUMBLOCKS="${arg#numblocks=}"
      shift
      ;;
    invalidrate=*)
      INVALIDRATE="${arg#invalidrate=}"
      shift
      ;;
    statistics=*)
      STATISTICS="${arg#statistics=}"
      shift
      ;;
    http=*)
      HTTP_IMPLEMENTATION_ENDPOINT="${arg#http=}"
      shift
      ;;
    host_ip=*)
      HOST_IP="${arg#host_ip=}"
      shift
      ;;
    *)
      ;;
  esac
done

# Set defaults
HTTP_IMPLEMENTATION_ENDPOINT="${HTTP_IMPLEMENTATION_ENDPOINT:-http://localhost}"
MODE="${MODE:-safrole}"
NUMBLOCKS="${NUMBLOCKS:-50}"
INVALIDRATE="${INVALIDRATE:-0}"
STATISTICS="${STATISTICS:-25}"

CONTAINER_NAME="importblocks_container"
REGISTRY="us-central1-docker.pkg.dev"
REPOSITORY="importblocks"
BINARY="importblocks"
PROJECT="jam-duna"
IMAGE="${REGISTRY}/${PROJECT}/${REPOSITORY}/${BINARY}:latest"

# HOST_IP Overwrite
OPTIONAL_ADD_HOST_FLAG=""
if [ -n "${HOST_IP:-}" ]; then
  OPTIONAL_ADD_HOST_FLAG="--add-host ${HOST_IP}"
fi

# Clean up any existing container.
docker stop "${CONTAINER_NAME}" 2>/dev/null || true
docker rm "${CONTAINER_NAME}" 2>/dev/null || true

echo "Pulling Docker Image: ${IMAGE}"
docker pull "${IMAGE}" > /dev/null

# Container Ready
CONTAINER_ID=$(docker run -d \
  --name "${CONTAINER_NAME}" \
  --hostname "${CONTAINER_NAME}" \
  ${OPTIONAL_ADD_HOST_FLAG} \
  "${IMAGE}")

echo "Spining up '${CONTAINER_NAME}'..."
until [ "$(docker inspect -f '{{.State.Health.Status}}' "${CONTAINER_NAME}")" = "healthy" ]; do
  sleep 1
done

echo "Start Importblocks:"
echo "docker exec -it ${CONTAINER_NAME} ./importblocks --mode=${MODE} --http=\"${HTTP_IMPLEMENTATION_ENDPOINT}\" --invalidrate=${INVALIDRATE} --numblocks=${NUMBLOCKS} --statistics=${STATISTICS}"
docker exec -it "${CONTAINER_NAME}" ./importblocks --mode="${MODE}" --http="${HTTP_IMPLEMENTATION_ENDPOINT}" --invalidrate="${INVALIDRATE}" --numblocks="${NUMBLOCKS}" --statistics="${STATISTICS}"