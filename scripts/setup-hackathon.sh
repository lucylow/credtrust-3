#!/bin/bash
echo "🚀 Setting up CredTrust for iExec Hack4Privacy..."

# Install dependencies
npm install

# Setup environment
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "✅ Created .env.local from example"
fi

# Run deployment script (mock)
npm run iexec:deploy

echo ""
echo "✅ Setup Complete!"
echo "Run 'npm run dev' to start the application."
echo "Demo available at: http://localhost:8080/iexec-demo"
