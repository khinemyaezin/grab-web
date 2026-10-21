#!/bin/bash

set -euo pipefail

WORKSPACES=(
  # grab-seller-auth
  # grab-seller-product
  # grab-seller-pricing
  grab-seller-account
  # grab-seller-inventory
  grab-seller
)

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

trap 'echo "Stopping all dev servers..."; kill $(jobs -p) 2>/dev/null || true' SIGINT SIGTERM

echo ""
echo "Starting dev servers..."
for ws in "${WORKSPACES[@]}"; do
  echo "→ Starting ${ws}..."
  (cd "${ROOT_DIR}/${ws}" && npm run build && npm run dev) &
done

echo ""
echo "All dev servers started."
echo "Press Ctrl+C to stop all of them."
echo ""

wait
