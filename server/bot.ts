
import { Client, GatewayIntentBits, Partials, Events, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextChannel, ChannelType, PermissionsBitField, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import { storage } from './storage';

let client: Client;
const AUTO_PIN_CHANNEL_ID = "1439165973708935209";

export async function startBot(token: string) {
  if (client) return;

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });

  client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    await deployPanel();
    await reconnectToOpenTickets(c);
  });

  // Auto-reconnect on disconnect
  client.on(Events.Warn, (msg) => {
    console.warn(`Discord warning: ${msg}`);
  });

  client.on('error', (error) => {
    console.error('Discord client error:', error);
  });

  // Re-login on disconnect
  client.on(Events.Invalidated, async () => {
    console.log('Session invalidated, reconnecting...');
    try {
      await client.login(token);
    } catch (error) {
      console.error('Reconnect failed:', error);
      setTimeout(() => client.login(token), 5000);
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'ticket_category') {
        await handleTicketCategorySelect(interaction);
      }
    } else if (interaction.isButton()) {
      if (interaction.customId === 'close_ticket') {
        await handleCloseTicket(interaction);
      } else if (interaction.customId === 'claim_ticket') {
        await handleClaimTicket(interaction);
      }
    }
  });

  await client.login(token);
}

async function reconnectToOpenTickets(c: Client) {
  try {
    const tickets = await storage.getTickets();
    const openTickets = tickets.filter(t => t.status === 'open');
    
    console.log(`Reconnecting to ${openTickets.length} open tickets...`);
    
    for (const ticket of openTickets) {
      try {
        const guild = c.guilds.cache.first();
        if (!guild) continue;
        
        const channel = await guild.channels.fetch(ticket.channelId).catch(() => null);
        if (channel && channel.isTextBased()) {
          console.log(`Fetched open ticket: #${ticket.id}`);
          
          // Auto-pin the ticket to the ticket channel if configured
          if (channel.id === AUTO_PIN_CHANNEL_ID) {
            const messages = await (channel as TextChannel).messages.fetch({ limit: 1 });
            const lastMessage = messages.first();
            if (lastMessage && !lastMessage.pinned) {
              await lastMessage.pin().catch(e => console.log(`Could not pin: ${e.message}`));
              console.log(`Auto-pinned ticket #${ticket.id} to ${AUTO_PIN_CHANNEL_ID}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error reconnecting to ticket ${ticket.id}:`, error);
      }
    }
    
    // Refresh the ticket panel message
    await refreshTicketPanel(c);
  } catch (error) {
    console.error('Error in reconnectToOpenTickets:', error);
  }
}

async function refreshTicketPanel(c: Client) {
  try {
    const settings = await storage.getSettings();
    // Use configured panel channel or default to AUTO_PIN_CHANNEL_ID
    const channelId = settings?.panelChannelId || AUTO_PIN_CHANNEL_ID;

    const guild = c.guilds.cache.first();
    if (!guild) return;

    const channel = await guild.channels.fetch(channelId).catch(() => null);
    if (!channel || !channel.isTextBased()) {
      console.log('Panel channel not found or not text-based');
      return;
    }

    const textChannel = channel as TextChannel;

    // Delete old message if it exists
    if (settings?.lastPanelMessageId) {
      try {
        const oldMessage = await textChannel.messages.fetch(settings.lastPanelMessageId).catch(() => null);
        if (oldMessage) {
          await oldMessage.delete();
          console.log(`Deleted old panel message: ${settings.lastPanelMessageId}`);
        }
      } catch (error) {
        console.log(`Could not delete old message: ${(error as Error).message}`);
      }
    }

    // Get all panels
    const panels = await storage.getPanels();
    if (panels.length === 0) {
      console.log('No panels to post');
      return;
    }

    // Create embed showing all panels
    const embed = new EmbedBuilder()
      .setTitle('🆘 Support Tickets')
      .setColor(0xff6b35)
      .setDescription('Please choose the option that best matches your issue from the menu below.\nOnce you select, a private ticket channel will be created where our team can assist you.')
      .addFields(
        {
          name: '⏱️ How it works:',
          value: '• Pick a category from the menu 🎯\n• A new ticket will open 📝\n• Our staff will reply as soon as possible ✨'
        }
      )
      .setFooter({ text: 'IPEORG SUPPORT' });

    // Create select menu with all panels as options
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_category')
      .setPlaceholder('Choose a category')
      .addOptions(
        panels.map(panel => ({
          label: panel.title,
          description: panel.description,
          value: `panel_${panel.id}`,
          emoji: panel.emoji || undefined,
        }))
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    // Post new message
    const newMessage = await textChannel.send({
      embeds: [embed],
      components: [row],
    });

    // Update settings with new message ID
    await storage.updateSettings({
      lastPanelMessageId: newMessage.id,
    });

    console.log(`✅ Posted new panel message: ${newMessage.id}`);
  } catch (error) {
    console.error('Error refreshing ticket panel:', error);
  }
}

async function deployPanel() {
  const settings = await storage.getSettings();
  if (!settings?.guildId) return;

  const panels = await storage.getPanels();
  // Logic to post panels to a specific channel would go here
  // For now, we assume panels are created via command or dashboard trigger
}

async function handleTicketCategorySelect(interaction: any) {
  const panelId = parseInt(interaction.values[0].split('_')[1]);
  const settings = await storage.getSettings();
  const panel = await storage.getPanel(panelId);
  
  if (!interaction.guild) return;

  const ticketName = `ticket-${interaction.user.username}-${Date.now().toString().slice(-6)}`;
  
  // Create channel
  const channel = await interaction.guild.channels.create({
    name: ticketName,
    type: ChannelType.GuildText,
    parent: settings?.categoryOpenId,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
      },
      // Add staff roles here
      ...(settings?.staffRoles?.map((roleId: string) => ({
        id: roleId,
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] as any,
      })) || []),
    ],
  });

  const ticket = await storage.createTicket({
    channelId: channel.id,
    creatorId: interaction.user.id,
    status: 'open',
    panelId,
  });

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Close Ticket')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('claim_ticket')
        .setLabel('Claim Ticket')
        .setStyle(ButtonStyle.Primary),
    );

  const embed = new EmbedBuilder()
    .setTitle('🎫 Support Ticket Created')
    .setDescription(`Hello <@${interaction.user.id}>! Your support ticket has been created.\n\nA staff member will be with you shortly.`)
    .addFields(
      { name: 'Subject', value: 'Support Ticket', inline: false },
      { name: 'Description', value: panel?.title || 'Support Request', inline: false }
    )
    .setColor(0x5865F2);

  const message = await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed as any], components: [row as any] });
  
  // Auto-pin if this is the ticket channel
  if (channel.id === AUTO_PIN_CHANNEL_ID) {
    await message.pin().catch((e: Error) => console.log(`Could not pin: ${e.message}`));
    console.log(`Auto-pinned new ticket #${ticket.id}`);
  }
  
  // Defer the interaction
  await interaction.deferUpdate();
  
  await interaction.followUp({ content: `✅ Ticket created: <#${channel.id}>`, ephemeral: true }).catch(() => {});
}

async function generateHTMLTranscript(channel: TextChannel, ticket: any): Promise<string> {
  const messages = await channel.messages.fetch({ limit: 100 });
  const sortedMessages = Array.from(messages.values()).reverse();
  
  const guild = channel.guild;
  const user = await guild.members.fetch(ticket.creatorId).catch(() => null);
  const userName = user?.user.username || 'Unknown User';
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ticket Transcript #${ticket.id}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #36393f;
      color: #dcddde;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background-color: #2f3136;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    .header {
      border-bottom: 2px solid #202225;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0 0 5px 0;
      color: #fff;
      font-size: 24px;
    }
    .header p {
      margin: 5px 0;
      color: #99aab5;
      font-size: 14px;
    }
    .messages {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .message {
      display: flex;
      gap: 12px;
      padding: 8px 0;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #5865f2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 14px;
      flex-shrink: 0;
    }
    .message-content {
      flex: 1;
    }
    .message-author {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 4px;
    }
    .author-name {
      font-weight: 600;
      color: #fff;
    }
    .message-time {
      color: #72767d;
      font-size: 12px;
    }
    .message-text {
      color: #dcddde;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .system-message {
      color: #72767d;
      font-style: italic;
      font-size: 13px;
      padding: 8px 12px;
      background-color: #36393f;
      border-radius: 4px;
      margin: 5px 0;
    }
    .footer {
      border-top: 2px solid #202225;
      padding-top: 15px;
      margin-top: 20px;
      text-align: center;
      color: #72767d;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎫 Support Ticket Transcript</h1>
      <p><strong>Ticket ID:</strong> #${ticket.id}</p>
      <p><strong>User:</strong> ${userName}</p>
      <p><strong>Channel:</strong> #${channel.name}</p>
      <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
    </div>
    <div class="messages">`;

  for (const msg of sortedMessages) {
    if (msg.author.bot) continue;
    
    const time = msg.createdTimestamp 
      ? new Date(msg.createdTimestamp).toLocaleTimeString()
      : 'Unknown';
    
    const initials = msg.author.username.substring(0, 2).toUpperCase();
    
    html += `
      <div class="message">
        <div class="avatar">${initials}</div>
        <div class="message-content">
          <div class="message-author">
            <span class="author-name">${msg.author.username}</span>
            <span class="message-time">${time}</span>
          </div>
          <div class="message-text">${escapeHtml(msg.content)}</div>`;
    
    if (msg.embeds.length > 0) {
      for (const embed of msg.embeds) {
        html += `<div class="system-message">[Embed: ${embed.title || 'Embedded Content'}]</div>`;
      }
    }
    
    html += `</div></div>`;
  }

  html += `
    </div>
    <div class="footer">
      <p>Transcript generated on ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

async function handleCloseTicket(interaction: any) {
  const ticket = await storage.getTicketByChannelId(interaction.channelId);
  if (!ticket) return;

  await storage.updateTicketStatus(ticket.id, 'closed');
  
  const settings = await storage.getSettings();
  const channel = interaction.channel as TextChannel;
  const guild = channel.guild;
  
  try {
    // Generate HTML transcript
    const htmlTranscript = await generateHTMLTranscript(channel, ticket);
    const transcriptBuffer = Buffer.from(htmlTranscript, 'utf-8');
    
    // Send to user via DM
    try {
      const user = await guild.members.fetch(ticket.creatorId).catch(() => null);
      if (user) {
        await user.send({
          content: '📄 Your support ticket transcript:',
          files: [{
            attachment: transcriptBuffer,
            name: `ticket-${ticket.id}-transcript.html`
          }]
        }).catch(e => console.log(`Could not send DM: ${e.message}`));
      }
    } catch (error) {
      console.log('Error sending DM:', error);
    }
    
    // Send to transcript channel if configured
    if (settings?.transcriptChannelId) {
      try {
        const transcriptChannel = await guild.channels.fetch(settings.transcriptChannelId).catch(() => null);
        if (transcriptChannel && transcriptChannel.isTextBased()) {
          const textChannelArg = transcriptChannel as TextChannel;
          const embed = new EmbedBuilder()
            .setTitle('🎫 Ticket Closed')
            .setDescription(`Ticket #${ticket.id} from <@${ticket.creatorId}> has been closed.`)
            .setColor(0xff6b35);
          
          await textChannelArg.send({
            embeds: [embed],
            files: [{
              attachment: transcriptBuffer,
              name: `ticket-${ticket.id}-transcript.html`
            }]
          }).catch(e => console.log(`Could not send to transcript channel: ${e.message}`));
        }
      } catch (error) {
        console.log('Error sending to transcript channel:', error);
      }
    }
    
    // Send to specific channel ID if provided
    const TRANSCRIPT_CHANNEL_ID = "1439166007263498352";
    try {
      const specificChannel = await guild.channels.fetch(TRANSCRIPT_CHANNEL_ID).catch(() => null);
      if (specificChannel && specificChannel.isTextBased()) {
        const textChannelArg = specificChannel as TextChannel;
        const embed = new EmbedBuilder()
          .setTitle('🎫 Ticket Transcript')
          .setDescription(`Ticket #${ticket.id} from <@${ticket.creatorId}> has been closed.`)
          .setColor(0x5865f2);
        
        await textChannelArg.send({
          embeds: [embed],
          files: [{
            attachment: transcriptBuffer,
            name: `ticket-${ticket.id}-transcript.html`
          }]
        }).catch(e => console.log(`Could not send to specific channel: ${e.message}`));
      }
    } catch (error) {
      console.log('Error sending to specific channel:', error);
    }
    
  } catch (error) {
    console.error('Error generating transcript:', error);
  }
  
  await channel.send('✅ Transcript saved. Ticket closed. Channel will be deleted in 5 seconds.');

  setTimeout(async () => {
    if (channel) await channel.delete();
  }, 5000);
}

async function handleClaimTicket(interaction: any) {
    const channel = interaction.channel as TextChannel;
    const allowedRoles = [
      '1439165889785364581',
      '1439258461769695303',
      '1439165890464841799',
      '1439258100304711791',
      '1443329127473221843',
      '1439258760089702592',
      '1439258799088205915',
      '1439258937236127794'
    ];

    try {
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const hasPermission = member.roles.cache.some((role: any) => allowedRoles.includes(role.id));

      if (!hasPermission) {
        await interaction.reply({
          content: '❌ You do not have permission to claim tickets. Only staff members can claim support tickets.',
          ephemeral: true
        });
        return;
      }

      await channel.send(`✅ Ticket claimed by <@${interaction.user.id}>`);
      await interaction.reply({
        content: '✅ You have claimed this ticket.',
        ephemeral: true
      });
    } catch (error) {
      console.error('Error claiming ticket:', error);
      await interaction.reply({
        content: '❌ An error occurred while claiming the ticket.',
        ephemeral: true
      });
    }
}
