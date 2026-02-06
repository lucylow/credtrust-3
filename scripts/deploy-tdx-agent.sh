#!/bin/bash
# Production TDX agent deployment

# 1. Build + push Docker
docker build -f tdx/Dockerfile.tdx -t credtrust-elizaos-tdx:latest .
docker push credtrust-elizaos-tdx:latest

# 2. Update checksums
iexec app checksum --checksum $(docker inspect --format='{{index .RepoDigests 0}}' credtrust-elizaos-tdx:latest)

# 3. Deploy app
iexec app deploy

# 4. Encrypt + deploy character dataset
iexec dataset init --encrypted
cp src/agents/credtrust-agent.character.json datasets/original/
iexec dataset encrypt
iexec dataset push-secret
iexec dataset deploy

# 5. Run production agent
iexec app run \
  --dataset $DATASET_ADDRESS \
  --workerpool tdx-labs.pools.iexec.eth \
  --secret 1=twitter_username \
  --secret 2=discord_webhook \
  --watch
