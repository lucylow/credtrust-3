#!/usr/bin/env bash
set -euo pipefail

# Usage: scripts/iapp-task.sh <APP_ADDRESS> <PROTECTED_WALLET_DATA> <PROTECTED_CONTACTS> [MAX_PRICE]
APP_ADDRESS=${1:-}
PROT_WALLET=${2:-}
PROT_CONTACTS=${3:-}
MAXPRICE=${4:-0.5}

if [ -z "$APP_ADDRESS" ] || [ -z "$PROT_WALLET" ] || [ -z "$PROT_CONTACTS" ]; then
  echo "Usage: $0 <APP_ADDRESS> <PROTECTED_WALLET_DATA> <PROTECTED_CONTACTS> [MAX_PRICE]" >&2
  exit 1
fi

echo "⚡ Running iApp task on Bellecour..."
iexec iexec task run \
  --app "$APP_ADDRESS" \
  --data "$PROT_WALLET","$PROT_CONTACTS" \
  --maxprice "$MAXPRICE" \
  --watch