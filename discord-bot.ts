// discord-bot.ts
import { Client, GatewayIntentBits, SlashCommandBuilder, 
         SlashCommandStringOption, ChannelType, ThreadAutoArchiveDuration, WebSocketManager } from 'discord.js';
import { WebSocketServer, WebSocket } from 'ws';
import { z } from 'zod';

interface PendingApproval {
  id: string;
  agent: string;
  action: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
  details: any;
  wallet?: string;
  amount?: number;
  timestamp: number;
  threadId?: string;
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const pendingApprovals = new Map<string, PendingApproval>();
const wss = new WebSocketServer({ port: 8081 });

// Discord Bot Ready
client.once('ready', async () => {
  console.log(`🤖 ${client.user?.tag} online - HITL Discord ready`);
  
  // Register slash commands
  const commands = [
    new SlashCommandBuilder()
      .setName('approve')
      .setDescription('Approve pending agent decision')
      .addStringOption(new SlashCommandStringOption()
        .setName('decision_id')
        .setDescription('Decision ID from agent notification')
        .setRequired(true)),
    
    new SlashCommandBuilder()
      .setName('reject')
      .setDescription('Reject pending agent decision')
      .addStringOption(new SlashCommandStringOption()
        .setName('decision_id')
        .setDescription('Decision ID from agent notification')
        .setRequired(true))
  ];

  await client.application?.commands.set(commands);
  
  // Find/create approvals channel
  const guild = client.guilds.cache.first();
  const approvalsChannel = guild?.channels.cache.find(c => 
    c.name === 'agent-approvals') || 
    await guild?.channels.create({
      name: 'agent-approvals',
      type: ChannelType.GuildText,
      topic: 'Agent decision approvals - HITL required actions'
    });
  
  console.log(`📢 HITL channel: #${approvalsChannel?.name}`);
});

// Discord Slash Commands
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const decisionId = interaction.options.getString('decision_id')!;
  
  if (interaction.commandName === 'approve') {
    await handleApproval(interaction, decisionId, true);
  } else if (interaction.commandName === 'reject') {
    await handleApproval(interaction, decisionId, false);
  }
});

async function handleApproval(interaction: any, decisionId: string, approved: boolean) {
  const approval = pendingApprovals.get(decisionId);
  if (!approval) {
    return interaction.reply({ content: '❌ Decision not found', ephemeral: true });
  }

  // Notify WebSocket clients (agents)
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ 
        id: decisionId, 
        approved,
        approvedBy: interaction.user.tag,
        timestamp: Date.now()
      }));
    }
  });

  // Update Discord thread
  try {
    const channel = await client.channels.fetch(interaction.channelId);
    if (channel?.isTextBased() && 'threads' in channel) {
        const thread = await channel.threads.fetch(approval.threadId!);
        await thread?.send(`✅ **${approved ? 'APPROVED' : 'REJECTED'}** by ${interaction.user}\nAgent can proceed.`);
    }
  } catch (error) {
    console.error('Error updating thread:', error);
  }

  pendingApprovals.delete(decisionId);
  await interaction.reply({ 
    content: `✅ ${approved ? 'Approved' : 'Rejected'} decision **${decisionId.slice(0,8)}...**\nAgent notified.`, 
    ephemeral: true 
  });
}

// WebSocket HITL Notifications from Agents
wss.on('connection', (ws) => {
  console.log('Agent connected to HITL WebSocket');
  
  ws.on('message', async (data) => {
    try {
        const decision: PendingApproval = JSON.parse(data.toString());
        pendingApprovals.set(decision.id, decision);
        
        await notifyDiscordHITL(decision);
    } catch (e) {
        console.error('Error processing agent message:', e);
    }
  });
});

async function notifyDiscordHITL(decision: PendingApproval) {
  const guild = client.guilds.cache.first();
  const channel = guild?.channels.cache.find(c => c.name === 'agent-approvals');
  
  if (!channel?.isTextBased() || !('threads' in channel)) return;

  // Create thread for decision
  const thread = await channel.threads.create({
    name: `Agent ${decision.agent} - ${decision.action.slice(0, 50)}`,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
    reason: 'HITL Approval Required'
  });

  decision.threadId = thread.id;

  // Risk-based embed
  const riskEmoji = { LOW: '🟢', MEDIUM: '🟡', HIGH: '🔴' }[decision.riskLevel!];
  const color = { LOW: 0x00ff00, MEDIUM: 0xffff00, HIGH: 0xff0000 }[decision.riskLevel!];

  const embed = {
    title: `${riskEmoji} ${decision.agent.toUpperCase()} Decision`,
    color,
    fields: [
      { name: 'Action', value: decision.action, inline: false },
      { name: 'Risk Level', value: decision.riskLevel!, inline: true },
      { name: 'Confidence', value: `${(decision.confidence * 100).toFixed(1)}%`, inline: true },
      ...(decision.wallet ? [{ name: 'Wallet', value: decision.wallet.slice(0, 10) + '...', inline: true }] : []),
      ...(decision.amount ? [{ name: 'Amount', value: `$${decision.amount.toLocaleString()}`, inline: true }] : [])
    ],
    timestamp: new Date(decision.timestamp).toISOString(),
    footer: { text: `Decision ID: ${decision.id}` }
  };

  // Approval buttons
  const row = {
    type: 1,
    components: [
      {
        type: 2,
        style: 3, // Success
        label: '✅ APPROVE',
        customId: `approve_${decision.id}`
      },
      {
        type: 2, 
        style: 4, // Danger
        label: '❌ REJECT',
        customId: `reject_${decision.id}`
      }
    ]
  };

  await thread.send({ 
    content: `<@&${process.env.AGENT_ADMIN_ROLE}> **URGENT HITL REQUIRED**`,
    embeds: [embed],
    components: [row] as any
  });

  console.log(`📢 Discord HITL notified for ${decision.id}`);
}

if (process.env.DISCORD_TOKEN) {
    client.login(process.env.DISCORD_TOKEN);
} else {
    console.error('DISCORD_TOKEN not found in environment');
}
