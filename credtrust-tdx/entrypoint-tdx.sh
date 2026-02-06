#!/bin/bash
# entrypoint-tdx.sh
set -e

echo "🔒 Entering Intel TDX Trust Domain..."
echo "🏢 Workerpool: tdx-labs.pools.iexec.eth"
echo "🔑 MRENCLAVE: $IEXEC_MRENCLAVE"

# TDX-specific verification
if [[ -z "$IEXEC_MRENCLAVE" ]]; then
    echo "❌ TDX attestation failed - no MRENCLAVE"
    exit 1
fi

# Run CredTrust agent
cd /app
python3 src/credit-agent.py
