#!/bin/bash
# deploy-discord-hitl.sh

echo "🚀 Deploying ElizaOS Discord HITL System..."

# 1. Install dependencies
npm install

# 2. Environment setup
if [ ! -f .env ]; then
  cat > .env << EOF
DISCORD_TOKEN=your_discord_bot_token
AGENT_ADMIN_ROLE=1234567890123456789
OPENAI_API_KEY=sk-...
IEXEC_APP_ADDRESS=0x...
EOF
  echo "📝 Created .env template. Please update it with your actual tokens."
fi

# 3. Create Discord app + bot
echo "📋 Setup Instructions:
1. https://discord.com/developers/applications
2. Create new application → 'CredTrust HITL Bot'
3. Bot → Token → Copy to DISCORD_TOKEN
4. OAuth2 → URL Generator → bot + applications.commands
5. Invite bot to your server
6. Create #agent-approvals channel"

# 4. Start full system
echo "Starting system with concurrently..."
npm run fullstack
