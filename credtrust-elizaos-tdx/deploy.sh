#!/bin/bash
# deploy.sh
set -e

echo "🚀 Deploying ElizaOS TDX Agent..."

# 1. Build TDX container
echo "📦 Building TDX container..."
npm run tdx:build

# 2. Push to registry
echo "🐳 Pushing to Docker Hub..."
docker tag credtrust-elizaos-tdx:latest yourdockerusername/credtrust-elizaos-tdx:latest
docker push yourdockerusername/credtrust-elizaos-tdx:latest

# 3. Update checksums
echo "🔢 Updating iExec checksums..."
CHECKSUM=$(docker inspect --format='{{index .RepoDigests 0}}' yourdockerusername/credtrust-elizaos-tdx:latest | cut -d'@' -f2)
jq ".app.checksum = \"$CHECKSUM\"" iexec.json > iexec.tmp && mv iexec.tmp iexec.json

# 4. Deploy iExec app
echo "⚙️  Deploying iExec app..."
iexec app deploy

APP_ADDRESS=$(iexec app show | grep address | cut -d' ' -f2)

# 5. Encrypt and deploy character dataset
echo "🔐 Encrypting character config..."
./scripts/encrypt-character.sh

iexec dataset deploy

DATASET_ADDRESS=$(iexec dataset show | grep address | cut -d' ' -f2)

# 6. Run production agent
echo "🎯 Running TDX agent..."
iexec app run \
  --app $APP_ADDRESS \
  --dataset $DATASET_ADDRESS \
  --workerpool tdx-labs.pools.iexec.eth \
  --secret 1=twitter_username \
  --secret 2=discord_webhook \
  --watch

echo "✅ ElizaOS TDX Agent deployed!"
echo "App: $APP_ADDRESS"
echo "Dataset: $DATASET_ADDRESS"
