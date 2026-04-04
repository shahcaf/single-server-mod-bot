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

client.on('debug', (info) => {
    if (info.includes('Heartbeat')) return; // ignore heartbeat noise
    console.log(`[DJS Debug] ${info}`);
});

client.on('shardReady', (shardId) => {
    console.log(`[DJS Shard] Shard ${shardId} ready.`);
});

client.on('error', (error) => {
    console.error('[DJS Error]', error);
});

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
    console.log('[System] Waiting for database initialization...');
    await db._initPromise;
    
    console.log('[System] Attempting to connect to Discord Gateway...');
    client.login(process.env.BOT_TOKEN).then(() => {
        console.log('[System] Login call completed.');
    }).catch(err => {
        console.error('[Error] Failed to login. Check your BOT_TOKEN in .env file.');
        console.error(err);
    });
}

startup();
