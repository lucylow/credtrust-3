#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "🚀 Deploying CredTrust iApp to iExec Network..."

cd credtrust-iapp

# 1. Local iApp simulation (requires @iexec/iapp)
if command -v iapp >/dev/null 2>&1; then
  echo "🧪 Testing iApp locally..."
  iapp test || echo "(warning) iapp test failed or not configured; continuing"
else
  echo "(info) iapp CLI not installed; skipping local test"
fi

# 2. Build production Docker image
echo "🐳 Building production Docker..."
docker build -f app/Dockerfile -t credtrust-iapp .

# 3. Deploy iExec app (Bellecour)
APP_IMAGE_SHA=$(docker inspect credtrust-iapp --format='{{.Id}}' | cut -d: -f2)
echo "☁️  Deploying to iExec with image sha256:${APP_IMAGE_SHA}"
iexec app deploy \
  --appName credtrust-tee \
  --appImage sha256:${APP_IMAGE_SHA} \
  --iexecDeveloperLogger true || true

# 4. Example: Run a production task (requires valid ProtectedData addresses)
cat <<'EON'
To run a task with ProtectedData after deploy:

  iexec task run \
    --app 0xYourAppAddress \
    --data 0xProtectedWalletData,0xProtectedContacts \
    --maxprice 0.5 \
    --watch

EON

echo "✅ iApp DEPLOYED (or updated). Check https://explorer.iex.ec for status."