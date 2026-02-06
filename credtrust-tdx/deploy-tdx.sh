#!/bin/bash
# deploy-tdx.sh - Production TDX deployment
set -e

echo "🚀 Deploying CredTrust TDX Credit Agent..."

# 1. Build TDX Docker (lift-and-shift)
echo "📦 Building TDX container..."
docker build -f docker/Dockerfile.tdx -t credtrust-tdx:latest .
CHECKSUM=$(docker inspect --format='{{index .RepoDigests 0}}' credtrust-tdx:latest | cut -d'@' -f2)
echo "✅ Checksum: $CHECKSUM"

# 2. Push to Docker Hub
docker tag credtrust-tdx:latest yourdockerhub/credtrust-tdx:latest
docker push yourdockerhub/credtrust-tdx:latest

# 3. Initialize TDX app config
iexec app init --tee-framework tdx \
  --name credtrust-tdx-credit-agent \
  --docker yourdockerhub/credtrust-tdx:latest \
  --checksum $CHECKSUM

# 4. Deploy to iExec TDX workerpool
iexec app deploy

APP_ADDR=$(iexec app show | grep "App address" | awk '{print $3}')
echo "🎭 TDX App deployed: $APP_ADDR"

# 5. Run TDX task (experimental!)
echo "⚙️  Running TDX credit scoring..."
iexec app run $APP_ADDR \
  --async \
  --tag tee,tdx \
  --workerpool tdx-labs.pools.iexec.eth \
  --input '{
    "wallet_data": {
      "address": "0x1234567890abcdef1234567890abcdef12345678",
      "tx_count": 247,
      "tx_volume_usd": 125000,
      "wallet_age_days": 452
    }
  }' \
  --watch

echo "✅ TDX CredTrust LIVE! Check: iexec task show <taskId>"
