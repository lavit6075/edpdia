#!/usr/bin/env bash
# Vercel's build image is Amazon Linux, but `playwright install --with-deps` only knows
# apt-get, so it fails with "apt-get: command not found". Install the shared libraries
# Chromium needs directly via dnf/yum instead.
#
# Non-fatal by design: if this can't run (no dnf, not root), we let the prerender step be the
# thing that fails loudly, rather than masking a broken browser behind a silent skip.
set -u

if ! command -v dnf >/dev/null 2>&1 && ! command -v yum >/dev/null 2>&1; then
  echo "install-chromium-deps: no dnf/yum on this image — skipping"
  exit 0
fi

PKG=$(command -v dnf || command -v yum)
echo "install-chromium-deps: using $PKG"

# Runtime libs for headless Chromium. libnspr4.so lives in nspr; the rest cover
# graphics/a11y/audio stubs Chromium links against even in headless mode.
"$PKG" install -y -q \
  nss nspr atk at-spi2-atk at-spi2-core cups-libs libdrm libxkbcommon \
  libXcomposite libXdamage libXext libXfixes libXrandr libXScrnSaver \
  mesa-libgbm alsa-lib pango cairo 2>&1 | tail -5 || \
  echo "install-chromium-deps: package install reported errors (continuing; prerender will verify)"

echo "install-chromium-deps: done"
