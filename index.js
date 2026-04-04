require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const express = require('express');

// Initialize Express for Keep-Alive
const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
app.get('/', (req, res) => res.send('Bot is alive!'));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Fix Express for deployment (ensure it listens on all interfaces)
app.listen(PORT, '0.0.0.0', () => console.log(`Keep-alive server running on port ${PORT}`));

client.commands = new Collection();
client.cooldowns = new Collection();

// Load Database
require('./src/database/db.js');

// Autonomous Intelligence
const autonomous = require('./src/utils/autonomous');

// Load Handlers
const loadCommands = require('./src/handlers/commandHandler');
const loadEvents = require('./src/handlers/eventHandler');

loadCommands(client);
loadEvents(client);

client.once('ready', () => {
    console.log(`[System] Logged in as ${client.user.tag}`);
    autonomous.init(client);
    console.log('[System] Autonomous Intelligence Matrix engaged.');
});

// Error Handling to prevent crashes
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});

console.log('[System] Attempting to connect to Discord Gateway...');
client.login(process.env.BOT_TOKEN).then(() => {
    console.log('[System] Login call completed.');
}).catch(err => {
    console.error('[Error] Failed to login. Check your BOT_TOKEN in .env file.');
    console.error(err);
});
