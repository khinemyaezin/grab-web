#!/bin/bash
set -euo pipefail

# Runs development servers across the monorepo via Turborepo
# Usage:
#   ./start-dev.sh                                # Starts all applications
#   ./start-dev.sh grab-seller grab-seller-account # Starts specific apps

if [ $# -eq 0 ]; then
  pnpm turbo dev --filter=./apps/*
else
  FILTERS=""
  for app in "$@"; do
    FILTERS="$FILTERS --filter=*$app*"
  done
  pnpm turbo dev $FILTERS
fi
