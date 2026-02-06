#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Initializing CredTrust iApp with iApp Generator..."

# 1. Ensure generator is installed
if ! command -v iapp >/dev/null 2>&1; then
  npm install -g @iexec/iapp
fi

# 2. Create iApp folder if missing
mkdir -p credtrust-iapp

# 3. Write config (already versioned in repo); iapp init if desired
if [ ! -f credtrust-iapp/iapp.config.json ]; then
  iapp init credtrust-iapp || true
fi

cat <<'EOF' > credtrust-iapp/iapp.config.json
{
  "name": "credtrust-tee",
  "version": "1.0.0",
  "description": "Confidential ZKP Credit Scoring iApp",
  "author": "CredTrust Team",
  "language": "javascript",
  "entrypoint": "node app/credtrust.js",
  "secret": {
    "zkpKeys": "zkp_keys_secret_name",
    "web3mailConfig": "web3mail_config_secret_name"
  },
  "iexec": {
    "chainId": 134,
    "host": "https://bellecour.iex.ec"
  }
}
EOF

echo "✅ iApp initialized! Ready for TEE development."