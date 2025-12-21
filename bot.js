#!/usr/bin/env node

// Standalone Discord Bot Entry Point
// Use this to run the bot independently: node bot.js

const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers,
  ],
  partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
});

const AUTO_PIN_CHANNEL_ID = "1439165973708935209";
const TICKET_PANEL_CHANNEL_ID = "1439165973708935209"; // Channel where ticket panels are posted
const TICKET_ROLE_ID = "1439165889785364581";

// Store last panel message ID in memory
let lastPanelMessageId = null;

client.once(Discord.Events.ClientReady, async (c) => {
  console.log(`✅ Bot Ready! Logged in as ${c.user.tag}`);
  console.log(`🤖 Watching ${c.guilds.cache.size} guild(s)`);
  
  // Set bot status
  c.user.setActivity('IPEORG Support', { type: 'LISTENING' });
  
  // Reconnect to all open tickets and refresh panel
  await reconnectToTickets(c);
  await refreshTicketPanel(c);
});

// Handle disconnects and auto-reconnect
client.on(Discord.Events.Invalidated, async () => {
  console.log('⚠️ Session invalidated, reconnecting...');
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('Reconnect failed:', error.message);
    process.exit(1);
  }
});

client.on('error', (error) => {
  console.error('❌ Discord client error:', error.message);
});

client.on('warn', (msg) => {
  console.warn('⚠️ Discord warning:', msg);
});

// Handle button interactions
client.on(Discord.Events.InteractionCreate, async (interaction) => {
  try {
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
  } catch (error) {
    console.error('Interaction error:', error.message);
    if (!interaction.replied) {
      interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(console.error);
    }
  }
});

async function reconnectToTickets(client) {
  try {
    console.log('🔄 Reconnecting to open tickets...');
    for (const guild of client.guilds.cache.values()) {
      const channels = await guild.channels.fetch();
      let ticketCount = 0;
      
      for (const channel of channels.values()) {
        if (channel?.isTextBased() && channel.name.startsWith('ticket-')) {
          ticketCount++;
          
          // Auto-pin if it's the ticket channel
          if (channel.id === AUTO_PIN_CHANNEL_ID) {
            try {
              const messages = await channel.messages.fetch({ limit: 5 });
              for (const msg of messages.values()) {
                if (!msg.pinned && msg.author.id === client.user.id) {
                  await msg.pin();
                  console.log(`📌 Auto-pinned message in ${channel.name}`);
                  break;
                }
              }
            } catch (error) {
              console.log(`Could not pin in ${channel.name}: ${error.message}`);
            }
          }
        }
      }
      
      if (ticketCount > 0) {
        console.log(`✅ Found ${ticketCount} ticket channels in ${guild.name}`);
      }
    }
  } catch (error) {
    console.error('Error reconnecting to tickets:', error.message);
  }
}

async function refreshTicketPanel(client) {
  try {
    console.log('🔄 Refreshing ticket panel...');
    
    const guild = client.guilds.cache.first();
    if (!guild) {
      console.log('No guilds found');
      return;
    }

    // Use default ticket panel channel
    const channelId = TICKET_PANEL_CHANNEL_ID;
    const channel = await guild.channels.fetch(channelId).catch(() => null);
    if (!channel || !channel.isTextBased()) {
      console.log('Panel channel not found or not text-based');
      return;
    }

    // Delete old message if it exists
    if (lastPanelMessageId) {
      try {
        const oldMessage = await channel.messages.fetch(lastPanelMessageId).catch(() => null);
        if (oldMessage) {
          await oldMessage.delete();
          console.log(`🗑️ Deleted old panel message: ${lastPanelMessageId}`);
        }
      } catch (error) {
        console.log(`Could not delete old message: ${error.message}`);
      }
    }

    // Create embed for ticket panels
    const embed = new Discord.EmbedBuilder()
      .setTitle('🆘 Support Tickets')
      .setColor(0xff6b35)
      .setDescription('Please choose the option that best matches your issue from the menu below.\nOnce you select, a private ticket channel will be created where our team can assist you.')
      .addFields({
        name: '⏱️ How it works:',
        value: '• Pick a category from the menu 🎯\n• A new ticket will open 📝\n• Our staff will reply as soon as possible ✨'
      })
      .setFooter({ text: 'IPEORG SUPPORT' });

    // Create select menu with ticket categories
    const selectMenu = new Discord.StringSelectMenuBuilder()
      .setCustomId('ticket_category')
      .setPlaceholder('Choose a category')
      .addOptions(
        { label: 'General Support', description: 'General help and questions', value: 'panel_1', emoji: '💬' },
        { label: 'Bug Report', description: 'Report a bug or issue', value: 'panel_2', emoji: '🐛' },
        { label: 'Billing Support', description: 'Billing related questions', value: 'panel_3', emoji: '💳' },
        { label: 'Report', description: 'Report a problem or complaint', value: 'panel_4', emoji: '⚠️' }
      );

    const row = new Discord.ActionRowBuilder()
      .addComponents(selectMenu);

    // Post new message
    const newMessage = await channel.send({
      embeds: [embed],
      components: [row],
    });

    lastPanelMessageId = newMessage.id;
    console.log(`✅ Posted new panel message with select menu: ${newMessage.id}`);
  } catch (error) {
    console.error('Error refreshing ticket panel:', error.message);
  }
}

async function handleTicketCategorySelect(interaction) {
  const guild = interaction.guild;
  if (!guild) return;

  const ticketName = `ticket-${interaction.user.username}-${Date.now().toString().slice(-6)}`;
  
  const channel = await guild.channels.create({
    name: ticketName,
    type: Discord.ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [Discord.PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: interaction.user.id,
        allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
      },
      {
        id: TICKET_ROLE_ID,
        allow: [Discord.PermissionsBitField.Flags.ViewChannel, Discord.PermissionsBitField.Flags.SendMessages],
      },
    ],
  });

  const row = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Close Ticket')
        .setStyle(Discord.ButtonStyle.Danger),
      new Discord.ButtonBuilder()
        .setCustomId('claim_ticket')
        .setLabel('Claim Ticket')
        .setStyle(Discord.ButtonStyle.Primary),
    );

  const embed = new Discord.EmbedBuilder()
    .setTitle('Support Ticket')
    .setDescription('Support team will help you soon!')
    .setColor(0x5865F2)
    .setFooter({ text: 'IPEORG SUPPORT' });

  const message = await channel.send({ 
    content: `<@${interaction.user.id}> Welcome to support!`, 
    embeds: [embed], 
    components: [row] 
  });

  // Auto-pin if this is the ticket channel
  if (channel.id === AUTO_PIN_CHANNEL_ID) {
    await message.pin().catch(e => console.log(`Could not pin: ${e.message}`));
  }

  // Defer the select menu interaction
  await interaction.deferUpdate();

  await interaction.followUp({ content: `✅ Ticket created: <#${channel.id}>`, ephemeral: true }).catch(() => {});
}

async function handleCloseTicket(interaction) {
  const channel = interaction.channel;
  if (!channel || !channel.isTextBased()) return;

  await channel.send('❌ Ticket closed. Channel will be deleted in 10 seconds...');
  
  setTimeout(async () => {
    await channel.delete().catch(e => console.log(`Could not delete: ${e.message}`));
  }, 10000);

  await interaction.deferUpdate();
}

async function handleClaimTicket(interaction) {
  const channel = interaction.channel;
  if (!channel || !channel.isTextBased()) return;

  const embed = new Discord.EmbedBuilder()
    .setDescription(`🎫 Ticket claimed by <@${interaction.user.id}>`)
    .setColor(0x57F287);

  await channel.send({ embeds: [embed] });
  await interaction.deferUpdate();
}

// Login to Discord
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN environment variable not set!');
  process.exit(1);
}

client.login(token).catch((error) => {
  console.error('❌ Failed to login:', error.message);
  process.exit(1);
});
