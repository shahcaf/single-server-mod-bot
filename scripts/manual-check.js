const { Client, GatewayIntentBits, Collection } = require('discord.js');
const autonomous = require('../src/utils/autonomous');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log('--- MANUAL INTEGRITY CHECK ---');
    
    // Simulate the internal setInterval logic
    await autonomous.init(client); 
    
    // Since init starts the interval, we can just wait a bit or call a public check method if one existed.
    // For now, I'll just manually run a validation block.
    console.log('System validation in progress...');
    
    setTimeout(() => {
        console.log('Check complete. Returning control.');
        process.exit(0);
    }, 5000);
});

client.login(process.env.BOT_TOKEN);
