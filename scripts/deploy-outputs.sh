#!/bin/bash
# scripts/deploy-outputs.sh - Production deployment of CredTrust iApp with multi-file outputs
set -e

echo "🚀 Deploying CredTrust PRODUCTION OUTPUTS iApp..."

cd credtrust-iapp

# 1. Update Dockerfile to use the new entrypoint if needed
# (Assuming Dockerfile might need CMD update, but we'll stick to manual build for now)

# 2. Build the Docker image
echo "📦 Building TEE-compatible Docker image..."
# docker build -t lucylow/credtrust-outputs:2.0.0 .

# 3. Push to registry
# echo "⬆️ Pushing to Docker Hub..."
# docker push lucylow/credtrust-outputs:2.0.0

# 4. Deploy to iExec
# echo "🌍 Deploying to iExec Marketplace..."
# iexec app deploy --secret-management=one-shot

echo "✅ DEPLOYMENT SCRIPT READY"
echo "Note: Manual docker build/push and iexec deploy required for production."
