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

# 5. Build services: shell and auth remote
echo "[docker:smoke] Building grab-seller-auth and grab-seller images..."
docker compose build grab-seller-auth grab-seller

# 6. Start services
echo "[docker:smoke] Starting grab-seller-auth and grab-seller..."
docker compose up -d grab-seller-auth grab-seller

# 7. Wait for containers to be healthy or respond to HTTP
echo "[docker:smoke] Waiting for services to respond..."
AUTH_PORT="${AUTH_PORT:-3003}"
SELLER_PORT="${SELLER_PORT:-3000}"

max_retries=30
counter=0
auth_ok=false
seller_ok=false

while [ $counter -lt $max_retries ]; do
  if [ "$auth_ok" = false ]; then
    if curl -s -f -o /dev/null "http://localhost:${AUTH_PORT}/mf-manifest.json"; then
      echo "[docker:smoke] grab-seller-auth is responding at http://localhost:${AUTH_PORT}/mf-manifest.json"
      auth_ok=true
    fi
  fi

  if [ "$seller_ok" = false ]; then
    if curl -s -f -o /dev/null "http://localhost:${SELLER_PORT}/"; then
      echo "[docker:smoke] grab-seller is responding at http://localhost:${SELLER_PORT}/"
      seller_ok=true
    fi
  fi

  if [ "$auth_ok" = true ] && [ "$seller_ok" = true ]; then
    break
  fi

  counter=$((counter + 1))
  sleep 2
done

if [ "$auth_ok" != true ] || [ "$seller_ok" != true ]; then
  echo "[docker:smoke] Healthcheck failed after timeout!"
  docker compose ps
  docker compose logs --tail=50
  exit 1
fi

echo "[docker:smoke] Container healthchecks passed successfully!"
docker compose ps
