#!/usr/bin/env bash
set -euo pipefail
# User configures remote and authentication outside source. No force push.
git diff --quiet
git diff --cached --quiet
git remote get-url domestic >/dev/null
git push domestic HEAD:main
