#!/bin/bash
# deploy-eliza-tdx.sh
set -e

echo "🚀 Deploying ElizaOS + iExec TDX..."

# 1. Build TDX container
docker build -f docker/Dockerfile.eliza-tdx -t credtrust-elizaos-tdx:latest .
CHECKSUM=$(docker inspect --format='{{index .RepoDigests 0}}' credtrust-elizaos-tdx:latest | cut -d'@' -f2)

# 2. Push to registry
# docker tag credtrust-elizaos-tdx:latest yourdocker/credtrust-elizaos-tdx:latest
# docker push yourdocker/credtrust-elizaos-tdx:latest

# 3. Deploy TDX iApp
iexec app init --tee-framework tdx \
  --name credtrust-elizaos-tdx \
  --docker yourdocker/credtrust-elizaos-tdx:latest \
  --checksum $CHECKSUM

iexec app deploy

APP_ADDR=$(iexec app show | grep "App address" | awk '{print $3}')
echo "🎭 ElizaOS TDX App: $APP_ADDR"

# 4. Run production task
cat > input.json << EOF
{
  "goal": "Score wallet 0x1234567890abcdef1234567890abcdef12345678 for \$25k loan",
  "wallet": "0x1234567890abcdef1234567890abcdef12345678",
  "amount": 25000
}
EOF

TASK_ID=$(iexec app run $APP_ADDR \
  --input "$(cat input.json)" \
  --workerpool tdx-labs.pools.iexec.eth \
  --tag tee,tdx \
  --async \
  --watch | grep -o 'taskId: [0-9a-f]*' | cut -d' ' -f2)

echo "⚙️  TDX Task: iexec task show $TASK_ID"
