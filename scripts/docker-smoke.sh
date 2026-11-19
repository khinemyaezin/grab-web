#!/usr/bin/env bash
set -euo pipefail

# Scripts: docker smoke verification for shell + remotes
echo "[docker:smoke] Starting container smoke check..."

# 1. Verify Docker daemon is reachable
if ! docker info >/dev/null 2>&1; then
  echo "[docker:smoke] Error: Docker daemon is not running or not accessible."
  echo "[docker:smoke] Please start Docker Desktop or the docker daemon to run container smoke tests."
  exit 1
fi

# 2. Ensure docker network exists
NETWORK_NAME="${DOCKER_NETWORK:-grab-dev-network}"
if ! docker network inspect "$NETWORK_NAME" >/dev/null 2>&1; then
  echo "[docker:smoke] Creating external network: $NETWORK_NAME"
  docker network create "$NETWORK_NAME"
fi

# 3. Ensure Module Federation types exist for the shell build
if [ ! -f "apps/grab-seller/@mf-types/index.d.ts" ]; then
  echo "[docker:smoke] Generating missing @mf-types before container build..."
  pnpm mf:types
fi
pnpm check:mf-types

# 4. Clean up any previous test containers on exit
CLEANUP=true
if [[ "${1:-}" == "--keep" ]]; then
  CLEANUP=false
fi

cleanup() {
  if [ "$CLEANUP" = true ]; then
    echo "[docker:smoke] Cleaning up test containers..."
    docker compose down --remove-orphans || true
  else
    echo "[docker:smoke] Keeping containers running (--keep specified)."
  fi
}
trap cleanup EXIT

# 5. Build services: shell and account remote
echo "[docker:smoke] Building grab-seller-account and grab-seller images..."
docker compose build grab-seller-account grab-seller

# 6. Start services
echo "[docker:smoke] Starting grab-seller-account and grab-seller..."
docker compose up -d grab-seller-account grab-seller

# 7. Wait for containers to be healthy or respond to HTTP
echo "[docker:smoke] Waiting for services to respond..."
ACCOUNT_PORT="${ACCOUNT_PORT:-3004}"
SELLER_PORT="${SELLER_PORT:-3000}"

max_retries=30
counter=0
account_ok=false
seller_ok=false
account_healthy=false
seller_healthy=false

service_healthy() {
  local container_id
  container_id="$(docker compose ps -q "$1")"
  [[ -n "$container_id" ]] &&
    [[ "$(docker inspect --format '{{.State.Health.Status}}' "$container_id" 2>/dev/null)" == "healthy" ]]
}

while [ $counter -lt $max_retries ]; do
  if [ "$account_ok" = false ]; then
    if curl -s -f -o /dev/null "http://localhost:${ACCOUNT_PORT}/mf-manifest.json"; then
      echo "[docker:smoke] grab-seller-account is responding at http://localhost:${ACCOUNT_PORT}/mf-manifest.json"
      account_ok=true
    fi
  fi

  if [ "$seller_ok" = false ]; then
    if curl -s -f -o /dev/null "http://localhost:${SELLER_PORT}/"; then
      echo "[docker:smoke] grab-seller is responding at http://localhost:${SELLER_PORT}/"
      seller_ok=true
    fi
  fi

  if [ "$account_healthy" = false ] && service_healthy grab-seller-account; then
    echo "[docker:smoke] grab-seller-account Docker healthcheck is healthy"
    account_healthy=true
  fi

  if [ "$seller_healthy" = false ] && service_healthy grab-seller; then
    echo "[docker:smoke] grab-seller Docker healthcheck is healthy"
    seller_healthy=true
  fi

  if [ "$account_ok" = true ] && [ "$seller_ok" = true ] && \
    [ "$account_healthy" = true ] && [ "$seller_healthy" = true ]; then
    break
  fi

  counter=$((counter + 1))
  sleep 2
done

if [ "$account_ok" != true ] || [ "$seller_ok" != true ] || \
  [ "$account_healthy" != true ] || [ "$seller_healthy" != true ]; then
  echo "[docker:smoke] Healthcheck failed after timeout!"
  docker compose ps
  docker compose logs --tail=50
  exit 1
fi

echo "[docker:smoke] Container healthchecks passed successfully!"
docker compose ps
