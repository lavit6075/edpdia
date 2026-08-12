#!/usr/bin/env bash
# Assert that Chromium landed INSIDE node_modules, where Vercel's build cache will keep it.
#
# This exists because the previous mechanism failed open. `playwright_browsers_path=0` was set in
# .npmrc, but that is not a supported npm config key — npm only happened to forward it to the
# environment as npm_config_playwright_browsers_path, which Playwright happened to read. npm has
# been warning that it will stop doing this. The day it stops, Chromium silently installs to
# ~/.cache/ms-playwright instead, the build cache stops covering it, every deploy re-downloads
# 184 MiB, and NOTHING FAILS — builds just quietly get slower forever.
#
# The correct mechanism is a real environment variable, PLAYWRIGHT_BROWSERS_PATH=0, set in Vercel
# project settings. This script makes the failure loud if that ever stops being true.
set -euo pipefail

if [ "${PLAYWRIGHT_BROWSERS_PATH:-unset}" != "0" ]; then
  echo "check-browser-cache: FAIL — PLAYWRIGHT_BROWSERS_PATH is '${PLAYWRIGHT_BROWSERS_PATH:-unset}', expected '0'."
  echo "  Chromium will install outside node_modules and fall out of Vercel's build cache."
  echo "  Fix: set PLAYWRIGHT_BROWSERS_PATH=0 in Vercel project settings (all environments),"
  echo "  or export it locally before building."
  exit 1
fi

if [ ! -d node_modules/playwright-core/.local-browsers ]; then
  echo "check-browser-cache: FAIL — PLAYWRIGHT_BROWSERS_PATH=0 is set but no browsers in"
  echo "  node_modules/playwright-core/.local-browsers after install."
  exit 1
fi

SIZE=$(du -sh node_modules/playwright-core/.local-browsers | cut -f1)
echo "check-browser-cache: OK — browsers in node_modules ($SIZE), covered by the build cache"
