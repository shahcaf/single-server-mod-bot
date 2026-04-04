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

// Initialize commands and events
const loadCommands = require('./src/handlers/commandHandler');
const loadEvents = require('./src/handlers/eventHandler');
const autonomous = require('./src/utils/autonomous');

loadCommands(client);
loadEvents(client);

client.once('ready', () => {
    console.log(`[System] Logged in as ${client.user.tag}`);
    autonomous.init(client);
    console.log('[System] Autonomous Intelligence Matrix engaged.');
});

// Error Handling
process.on('unhandledRejection', error => console.error('Unhandled promise rejection:', error));
process.on('uncaughtException', error => console.error('Uncaught Exception:', error));

// Load database and login once ready
const db = require('./src/database/db.js');

async function startup() {
    await db._initPromise;
    console.log('[System] Database ready. Connecting to Discord Gateway...');
    
    client.login(process.env.BOT_TOKEN).catch(err => {
        console.error('[Error] Failed to login:', err);
    });
}

startup();
