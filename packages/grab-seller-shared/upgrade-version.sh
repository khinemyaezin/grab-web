#!/usr/bin/env bash

set -e

echo "Manual version bumps are disabled for this monorepo."
echo ""
echo "Use Changesets instead:"
echo "  npm run changeset"
echo ""
echo "After the change is merged to main, GitHub Actions will open a version PR."
echo "Merging that version PR publishes the fixed package group together."
exit 1
