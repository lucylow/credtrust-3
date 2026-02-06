#!/bin/bash
# deploy-dual.sh
echo "🚀 Deploying SGX + TDX Dual Framework..."

# 1. Build both frameworks
docker build -f sgx/Dockerfile.sgx -t credtrust-sgx:latest .
docker build -f tdx/Dockerfile.tdx.dual -t credtrust-tdx:latest .

# 2. Deploy SGX (Production)
echo "🛡️ Deploying SGX (Production)..."
iexec app deploy sgx/iexec-sgx.json

# 3. Deploy TDX (Experimental)  
echo "🔬 Deploying TDX (Experimental)..."
EXPERIMENTAL_TDX_APP=true iexec app deploy tdx/iexec-tdx.json

# 4. Test dual execution
echo "⚙️  Testing SGX..."
# Note: In real scenario, replace <SGX_APP> with actual app address or name
# iexec app run credtrust-sgx --workerpool sgx-labs.pools.iexec.eth --watch

echo "⚙️  Testing TDX..."
# EXPERIMENTAL_TDX_APP=true iexec app run credtrust-tdx \
#   --workerpool tdx-labs.pools.iexec.eth \
#   --tag tee,tdx \
#   --watch
