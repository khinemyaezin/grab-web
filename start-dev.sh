#!/bin/bash

trap 'echo "Stopping all dev servers..."; kill $(jobs -p)' SIGINT

echo "Starting grab-seller-auth..."
(cd grab-seller-auth && npm run build && npm run dev) &

echo "Starting grab-seller-account..."
(cd grab-seller-account && npm run build && npm run dev) &

echo "Starting grab-seller..."
(cd grab-seller && npm run build && npm run dev) &

echo ""
echo "🚀 All dev servers started successfully!"
echo "Press Ctrl+C to stop all of them."
echo ""

# Wait for all background jobs to finish
wait
