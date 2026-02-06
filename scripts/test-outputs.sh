#!/bin/bash
# scripts/test-outputs.sh - Test COMPLETE outputs structure
set -e

echo "🧪 Testing CredTrust PRODUCTION OUTPUTS..."

# Go to iapp directory
cd credtrust-iapp

# 1. Clean previous outputs
# Since we are on Windows/PowerShell for most commands but using bash for this script,
# we'll assume standard iexec environment paths or local relative paths.
export IEXEC_OUT="./iexec_out"
rm -rf $IEXEC_OUT/*
mkdir -p $IEXEC_OUT

# 2. Run the generator locally
echo "1️⃣ Running output generator..."
node app/credtrust-outputs.js

# 3. Verify computed.json (MANDATORY)
if [ -f "$IEXEC_OUT/computed.json" ]; then
  echo "✅ computed.json created ✓"
  cat $IEXEC_OUT/computed.json
else
  echo "❌ computed.json MISSING!"
  exit 1
fi

# 4. Verify all output files
echo "2️⃣ Verifying output files..."
required_files=("result.json" "proof.json" "campaigns.json" "charts.json" "logs.txt" "computed.json")
for file in "${required_files[@]}"; do
  if [ -f "$IEXEC_OUT/$file" ]; then
    echo "✅ $file ✓ ($(wc -c < "$IEXEC_OUT/$file") bytes)"
  else
    echo "❌ $file MISSING!"
    exit 1
  fi
done

# 5. Validate JSON structure
echo "3️⃣ Validating JSON..."
node -e "
  const fs = require('fs');
  const path = require('path');
  const iexecOut = process.env.IEXEC_OUT || './iexec_out';
  ['result.json', 'proof.json', 'campaigns.json', 'charts.json', 'computed.json'].forEach(f => {
    try {
      JSON.parse(fs.readFileSync(path.join(iexecOut, f)));
      console.log('✅ ' + f + ' ✓');
    } catch(e) {
      console.log('❌ ' + f + ' INVALID JSON: ' + e.message);
      process.exit(1);
    }
  });
"

echo "✅ ALL OUTPUTS PRODUCTION READY!"
echo "📁 Total files: 6 | Ready for user retrieval via DataProtector.getResults()"
ls -la $IEXEC_OUT/
