#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLATFORM_DIR="$ROOT_DIR/grab-seller-shared-ui"
APPS=("grab-seller-product" "grab-seller-inventory" "grab-seller")
echo "Building shared seller packages..."
(
  cd "$PLATFORM_DIR"
  npm install
  npm run build
)

for app in "${APPS[@]}"; do
  echo "Linking local shared packages in $app..."
  grab_dir="$ROOT_DIR/$app/node_modules/@grab"
  mkdir -p "$grab_dir"

  for package in seller-api seller-contracts seller-ui; do
    rm -rf "$grab_dir/$package"
    ln -s "$PLATFORM_DIR/packages/$package" "$grab_dir/$package"
  done
done

if [[ "${1:-}" == "--setup-only" ]]; then
  echo "Local package setup complete."
  exit 0
fi

pids=()

cleanup() {
  if [[ ${#pids[@]} -gt 0 ]]; then
    kill "${pids[@]}" 2>/dev/null || true
    wait "${pids[@]}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

start_app() {
  local app="$1"
  (
    cd "$ROOT_DIR/$app"
    npm run dev
  ) &
  pids+=("$!")
}

echo "Starting Product : http://localhost:3001"
start_app "grab-seller-product"

echo "Starting Inventory: http://localhost:3002"
start_app "grab-seller-inventory"

echo "Starting Seller   : http://localhost:3000"
start_app "grab-seller"


echo "Backend API is expected at http://localhost:8080"
echo "Press Ctrl+C to stop all frontend servers."

wait "${pids[@]}"
